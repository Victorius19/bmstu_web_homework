'use client';

import { useQuery } from '@tanstack/react-query';
import Create from './components/Create/Create';
import { Center, Space } from '@mantine/core';
import InterviewsTable from './components/InterviewsTable/InterviewsTable';
import { getSkills } from './skills/actions';
import { getEmployers } from './employees/actions';

export default function Page() {
    const { data: skills } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(),
    });

    const { data: employers } = useQuery({
        queryKey: ['employers'],
        queryFn: () => getEmployers(),
        refetchOnMount: 'always',
    });

    return (
        <>
            <InterviewsTable />
            <Space h='l' />
            <Center>
                {skills && employers && (
                    <Create skills={skills} employers={employers} />
                )}
            </Center>
        </>
    );
}
