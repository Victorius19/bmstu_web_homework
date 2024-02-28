'use client';

import { Button, Center, Loader, Table } from '@mantine/core';
import type { FC } from 'react';
import { deleteInterview, getInterviews } from '../../actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { number2time } from '@/lib/utils';
// import Update from '../Update/Update';
import { getSkills } from '@/app/skills/actions';
import { getEmployers } from '@/app/employees/actions';
import Update from '../Update/Update';

const EmployersTable: FC = () => {
    const { data: skills } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(),
        refetchOnMount: 'always',
    });

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['interviews'],
        queryFn: () => getInterviews(),
        refetchOnMount: 'always',
    });

    const { data: employers } = useQuery({
        queryKey: ['employers'],
        queryFn: () => getEmployers(),
        refetchOnMount: 'always',
    });

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteInterview,
        onSuccess: (deletedInterview) => {
            queryClient.setQueryData(
                ['interviews'],
                (interviews: Awaited<ReturnType<typeof getInterviews>>) =>
                    interviews.filter((el) => el.id !== deletedInterview.id),
            );

            queryClient.setQueryData(
                ['employers'],
                (employers: Awaited<ReturnType<typeof getEmployers>>) =>
                    employers.map((emp) => ({
                        ...emp,
                        interviews: emp.interviews.filter(
                            (interview) => interview.id !== deletedInterview.id,
                        ),
                    })),
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

    const rows = data.map((interview) => (
        <Table.Tr key={interview.id}>
            <Table.Td>{interview.interviewer.name}</Table.Td>
            <Table.Td>{interview.applicant}</Table.Td>
            <Table.Td>{number2time(interview.start)}</Table.Td>
            <Table.Td>{number2time(interview.duration)}</Table.Td>
            <Table.Td>
                {skills && employers && (
                    <Update
                        interview={interview}
                        skills={skills}
                        employers={employers}
                    />
                )}
            </Table.Td>
            <Table.Td>
                <Button
                    variant='filled'
                    onClick={() => deleteMutation.mutate({ id: interview.id })}
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
                    <Table.Th>Cотрудник</Table.Th>
                    <Table.Th>Собеседуемый</Table.Th>
                    <Table.Th>Время начала</Table.Th>
                    <Table.Th>Продолжительность</Table.Th>
                    <Table.Th>Редактирование</Table.Th>
                    <Table.Th>Удаление</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default EmployersTable;
