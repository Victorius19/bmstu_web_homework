'use client';

import { Button, Group, Modal, MultiSelect, TextInput } from '@mantine/core';
import { getEmployers, updateEmployer } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { nameValidation, workTimeValidation } from '../../validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { number2time, time2number } from '@/lib/utils';
import { getSkills } from '@/app/skills/actions';

type Form = {
    name: string;
    workStart: string;
    workEnd: string;
    skills: string[];
};

const Update = (
    employer: Awaited<ReturnType<typeof getEmployers>>[number] & {
        allSkills: Awaited<ReturnType<typeof getSkills>>;
    },
) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateEmployer,
        onSuccess: (updatedEmployer) => {
            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) =>
                    employers.map((el) =>
                        el.id === updatedEmployer.id ? updatedEmployer : el,
                    ),
            );
        },
    });

    const [opened, { open, close }] = useDisclosure(false);

    const initialSkills = employer.skills;

    const form = useForm<Form>({
        initialValues: {
            name: employer.name,
            workStart: number2time(employer.workStart),
            workEnd: number2time(employer.workEnd),
            skills: initialSkills.map((el) => el.title),
        },

        validate: {
            name: nameValidation,
        },
    });

    const onSubmit = (formData: Form) => {
        const timeError = workTimeValidation(
            formData.workStart,
            formData.workEnd,
        );

        if (timeError !== null) {
            form.setErrors({
                workStart: timeError,
                workEnd: timeError,
            });

            return;
        }

        const newSkills = formData.skills
            .map((el) => employer.allSkills.find((skill) => el === skill.title))
            .filter((el) => typeof el !== 'undefined') as Awaited<
            ReturnType<typeof getSkills>
        >;

        mutation.mutate({
            id: employer.id,
            name: formData.name,
            workStart: time2number(formData.workStart),
            workEnd: time2number(formData.workEnd),
            skillsConnect: newSkills.filter(
                (newSkill) =>
                    typeof initialSkills.find((el) => el.id === newSkill.id) ===
                    'undefined',
            ),
            skillsDisconnect: initialSkills.filter(
                (oldSkill) =>
                    typeof newSkills.find((el) => el.id === oldSkill.id) ===
                    'undefined',
            ),
        });

        close();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title='Редактировать сотрудника'
                centered
            >
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        withAsterisk
                        label='ФИО'
                        placeholder='Иванов Иван Иванович'
                        {...form.getInputProps('name')}
                    />

                    <TimeInput
                        label='Начало работы'
                        withAsterisk
                        description='Впишите время в часах и минутах'
                        mt='xs'
                        {...form.getInputProps('workStart')}
                    />

                    <TimeInput
                        label='Конец работы'
                        withAsterisk
                        description='Впишите время в часах и минутах'
                        mt='xs'
                        {...form.getInputProps('workEnd')}
                    />

                    <MultiSelect
                        label='Введите навыки'
                        placeholder='Введите навык'
                        data={employer.allSkills.map((el) => el.title)}
                        searchable
                        nothingFoundMessage='Ничего не найдено...'
                        mt='xs'
                        {...form.getInputProps('skills')}
                    />

                    <Group justify='flex-end' mt='md'>
                        <Button type='submit'>Обновить</Button>
                    </Group>
                </form>
            </Modal>
            <Button variant='filled' onClick={open}>
                Редактировать
            </Button>
        </>
    );
};

export default Update;
