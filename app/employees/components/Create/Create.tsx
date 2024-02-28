'use client';

import { Button, Group, Modal, MultiSelect, TextInput } from '@mantine/core';
import { createEmployer, getEmployers } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { nameValidation, workTimeValidation } from '../../validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { time2number } from '@/lib/utils';
import { getSkills } from '@/app/skills/actions';

type Form = {
    name: string;
    workStart: string;
    workEnd: string;
    skills: string[];
};

const Create = ({
    skills,
}: {
    skills: Awaited<ReturnType<typeof getSkills>>;
}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createEmployer,
        onSuccess: (newEmployer) => {
            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) => [
                    ...employers,
                    newEmployer,
                ],
            );
        },
    });

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm<Form>({
        initialValues: {
            name: '',
            workStart: '',
            workEnd: '',
            skills: [],
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

        mutation.mutate({
            name: formData.name,
            workStart: time2number(formData.workStart),
            workEnd: time2number(formData.workEnd),
            skills: formData.skills
                .map((el) => skills.find((skill) => el === skill.title))
                .filter((el) => typeof el !== undefined) as Awaited<
                ReturnType<typeof getSkills>
            >,
        });

        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title='Добавить сотрудника'
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
                        data={skills.map((el) => el.title)}
                        searchable
                        nothingFoundMessage='Ничего не найдено...'
                        mt='xs'
                        {...form.getInputProps('skills')}
                    />

                    <Group justify='flex-end' mt='md'>
                        <Button type='submit'>Добавить</Button>
                    </Group>
                </form>
            </Modal>
            <Button variant='filled' onClick={open}>
                Добавить сотрудника
            </Button>
        </>
    );
};

export default Create;
