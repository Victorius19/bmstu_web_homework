'use client';

import { useQuery } from '@tanstack/react-query';
import Create from './components/Create/Create';
import EmployersTable from './components/EmployersTable/EmployersTable';
import { Center, Space } from '@mantine/core';
import { getSkills } from '../skills/actions';

export default function Page() {
    const { data } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(),
    });

    return (
        <>
            <EmployersTable />
            <Space h='l' />
            <Center>{data && <Create skills={data} />}</Center>
        </>
    );
}
