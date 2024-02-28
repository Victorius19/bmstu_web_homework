'use client';

import { Button, Center, Loader, Table } from '@mantine/core';
import type { FC } from 'react';
import { getSkills, deleteSkill } from '../../actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SkillsTable: FC = () => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(),
    });
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteSkill,
        onSuccess: (deletedSkill) => {
            queryClient.setQueryData(
                ['skills'],
                (skills: Awaited<ReturnType<typeof getSkills>>) =>
                    skills.filter((el) => el.id !== deletedSkill.id),
            );
        },
    });

    if (isError) {
        throw Error('Get employers error: ' + error);
    }

    if (isPending) {
        return (
            <Center p='xl'>
                <Loader color='blue' />
            </Center>
        );
    }

    const rows = data.map((skill) => (
        <Table.Tr key={skill.id}>
            <Table.Td>{skill.id}</Table.Td>
            <Table.Td>{skill.title}</Table.Td>
            <Table.Td>
                <Button
                    variant='filled'
                    onClick={() => deleteMutation.mutate({ id: skill.id })}
                >
                    Удалить
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table stickyHeader stickyHeaderOffset={60}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Номер</Table.Th>
                    <Table.Th>Наименование</Table.Th>
                    <Table.Th>Удалить</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default SkillsTable;
