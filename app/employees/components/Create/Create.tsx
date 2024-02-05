'use client';

import {
    Button,
    Center,
    Checkbox,
    Group,
    Modal,
    MultiSelect,
    Space,
    TextInput,
} from '@mantine/core';
import { createEmployer } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { nameValidation, workTimeValidation } from '../../validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { time2number } from '@/lib/utils';

type Form = {
    name: string;
    workStart: string;
    workEnd: string;
    skills: string[];
};

const Create = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createEmployer,
        onSuccess: (newEmployer) => {
            queryClient.setQueryData(['employers'], (employers) => [
                ...employers,
                newEmployer,
            ]);
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
        });

        close();
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
                        data={['React', 'Angular', 'Vue', 'Svelte']}
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
