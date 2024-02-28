'use client';

import { Button, Center, Loader, Table } from '@mantine/core';
import type { FC } from 'react';
import { deleteEmployer, getEmployers } from '../../actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { number2time } from '@/lib/utils';
import Update from '../Update/Update';
import { getSkills } from '@/app/skills/actions';

const EmployersTable: FC = () => {
    const { data: skills } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(),
    });

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['employers'],
        queryFn: () => getEmployers(),
        refetchOnMount: 'always',
    });
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteEmployer,
        onSuccess: (deletedEmployer) => {
            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) =>
                    employers.filter((el) => el.id !== deletedEmployer.id),
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

    const rows = data.map((employer) => (
        <Table.Tr key={employer.id}>
            <Table.Td>{employer.name}</Table.Td>
            <Table.Td>{number2time(employer.workStart)}</Table.Td>
            <Table.Td>{number2time(employer.workEnd)}</Table.Td>
            <Table.Td>
                {skills && <Update {...employer} allSkills={skills} />}
            </Table.Td>
            <Table.Td>
                <Button
                    variant='filled'
                    onClick={() => deleteMutation.mutate({ id: employer.id })}
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
                    <Table.Th>Имя</Table.Th>
                    <Table.Th>Время начала работы</Table.Th>
                    <Table.Th>Время конца работы</Table.Th>
                    <Table.Th>Редактирование</Table.Th>
                    <Table.Th>Удаление</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default EmployersTable;
