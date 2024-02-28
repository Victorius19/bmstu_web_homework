'use client';

import { Button, Group, Modal, TextInput } from '@mantine/core';
import { createSkill, getSkills } from '../../actions';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Form = {
    title: string;
};

const Create = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createSkill,
        onSuccess: (newSkill) => {
            queryClient.setQueryData(
                ['skills'],
                (skills: Awaited<ReturnType<typeof getSkills>>) => [
                    ...skills,
                    newSkill,
                ],
            );
        },
    });

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm<Form>({
        initialValues: {
            title: '',
        },
        validate: {
            title: (value) =>
                value.length < 2 || value.length > 21
                    ? 'длина поля должна быть от 3 до 20 символов'
                    : null,
        },
    });

    const onSubmit = (formData: Form) => {
        mutation.mutate({
            title: formData.title,
        });

        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title='Добавить навык'
                centered
            >
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        withAsterisk
                        label='Навык'
                        placeholder='JavaScript'
                        {...form.getInputProps('title')}
                    />

                    <Group justify='flex-end' mt='md'>
                        <Button type='submit'>Добавить</Button>
                    </Group>
                </form>
            </Modal>
            <Button variant='filled' onClick={open}>
                Добавить навык
            </Button>
        </>
    );
};

export default Create;
