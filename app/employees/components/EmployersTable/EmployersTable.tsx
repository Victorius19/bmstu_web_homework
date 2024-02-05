'use client';

import { Center, Loader, Table } from '@mantine/core';
import type { FC } from 'react';
import { getEmployers } from '../../actions';
import { useQuery } from '@tanstack/react-query';

const EmployersTable: FC = () => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['employers'],
        queryFn: () => getEmployers(),
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
            <Table.Td>{employer.workStart}</Table.Td>
            <Table.Td>{employer.workEnd}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table stickyHeader stickyHeaderOffset={60}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Имя</Table.Th>
                    <Table.Th>Время начала работы</Table.Th>
                    <Table.Th>Время конца работы</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default EmployersTable;
