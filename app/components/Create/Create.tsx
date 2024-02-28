'use client';

import {
    Button,
    Group,
    Modal,
    MultiSelect,
    Select,
    TextInput,
} from '@mantine/core';
import { createInterview, getInterviews } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { time2number } from '@/lib/utils';
import { getSkills } from '@/app/skills/actions';
import { nameValidation } from '@/app/employees/validation';
import { getEmployers } from '@/app/employees/actions';
import { interviewTimeValidation, skillsValidation } from '@/app/validation';

type Form = {
    applicant: string;
    start: string;
    duration: string;
    interviewer: string;
    skills: string[];
};

const Create = ({
    skills,
    employers,
}: {
    skills: Awaited<ReturnType<typeof getSkills>>;
    employers: Awaited<ReturnType<typeof getEmployers>>;
}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createInterview,
        onSuccess: (newInterview) => {
            queryClient.setQueryData(
                ['interviews'],
                (interviews: Awaited<ReturnType<typeof getInterviews>>) => [
                    ...interviews,
                    newInterview,
                ],
            );

            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) =>
                    employers.map((emp) =>
                        emp.id === newInterview.interviewer.id
                            ? {
                                  ...emp,
                                  interviews: [...emp.interviews, newInterview],
                              }
                            : emp,
                    ),
            );
        },
    });

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm<Form>({
        initialValues: {
            applicant: '',
            start: '',
            duration: '',
            interviewer: '',
            skills: [],
        },

        validate: {
            applicant: nameValidation,
            interviewer: nameValidation,
        },
    });

    const onSubmit = (formData: Form) => {
        const timeError = interviewTimeValidation(
            formData.start,
            formData.duration,
            employers,
            formData.interviewer,
        );

        if (timeError !== null) {
            form.setErrors({
                start: timeError,
                duration: timeError,
            });

            return;
        }

        const skillsError = skillsValidation(
            formData.skills,
            employers,
            formData.interviewer,
        );

        if (skillsError !== null) {
            form.setErrors({
                skills: skillsError,
            });

            return;
        }

        const interviewer = employers.find(
            (el) => el.name === form.values.interviewer,
        ) as (typeof employers)[number];

        mutation.mutate({
            applicant: formData.applicant,
            start: time2number(formData.start),
            duration: time2number(formData.duration),
            interviewerId: interviewer.id,
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
                title='Добавить собеседование'
                centered
            >
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        withAsterisk
                        label='ФИО собеседуемого'
                        placeholder='Иванов Иван Иванович'
                        {...form.getInputProps('applicant')}
                    />

                    <TimeInput
                        label='Начало собеседования'
                        withAsterisk
                        description='Впишите время в часах и минутах'
                        mt='xs'
                        {...form.getInputProps('start')}
                    />

                    <TimeInput
                        label='Продолжительность собеседования'
                        withAsterisk
                        description='Впишите время в часах и минутах'
                        mt='xs'
                        {...form.getInputProps('duration')}
                    />

                    <Select
                        label='Собеседующий'
                        placeholder='Введите собеседующего'
                        data={employers.map((el) => el.name)}
                        mt='xs'
                        {...form.getInputProps('interviewer')}
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
                Добавить собеседование
            </Button>
        </>
    );
};

export default Create;
