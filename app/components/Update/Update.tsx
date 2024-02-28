'use client';

import {
    Button,
    Group,
    Modal,
    MultiSelect,
    Select,
    TextInput,
} from '@mantine/core';
import { getInterviews, updateInterview } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { number2time, time2number } from '@/lib/utils';
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

const Update = ({
    skills,
    employers,
    interview,
}: {
    skills: Awaited<ReturnType<typeof getSkills>>;
    employers: Awaited<ReturnType<typeof getEmployers>>;
    interview: Awaited<ReturnType<typeof getInterviews>>[number];
}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateInterview,
        onSuccess: (updatedInterview) => {
            queryClient.setQueryData(
                ['interviews'],
                (interviews: Awaited<ReturnType<typeof getInterviews>>) =>
                    interviews.map((el) =>
                        el.id === updatedInterview.id ? updatedInterview : el,
                    ),
            );

            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) =>
                    employers.map((emp) =>
                        emp.id === updatedInterview.interviewer.id
                            ? {
                                  ...emp,
                                  interviews: emp.interviews.map((el) =>
                                      el.id === updatedInterview.id
                                          ? updatedInterview
                                          : el,
                                  ),
                              }
                            : emp,
                    ),
            );
        },
    });

    const [opened, { open, close }] = useDisclosure(false);

    const initialSkills = interview.skills;

    const form = useForm<Form>({
        initialValues: {
            applicant: interview.applicant,
            start: number2time(interview.start),
            duration: number2time(interview.duration),
            interviewer: interview.interviewer.name,
            skills: initialSkills.map((el) => el.title),
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
            employers.map((el) =>
                el.name === formData.interviewer
                    ? {
                          ...el,
                          interviews: el.interviews.filter(
                              (oldInterview) =>
                                  oldInterview.id !== interview.id,
                          ),
                      }
                    : el,
            ),
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

        const newSkills = formData.skills
            .map((el) => skills.find((skill) => el === skill.title))
            .filter((el) => typeof el !== 'undefined') as Awaited<
            ReturnType<typeof getSkills>
        >;

        mutation.mutate({
            id: interview.id,
            applicant: formData.applicant,
            start: time2number(formData.start),
            duration: time2number(formData.duration),
            interviewerId: interviewer.id,
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
                title='Обновить собеседование'
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
