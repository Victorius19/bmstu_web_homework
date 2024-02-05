import Create from './components/Create/Create';
import EmployersTable from './components/EmployersTable/EmployersTable';
import { Center, Space } from '@mantine/core';

export default function Page() {
    return (
        <>
            <EmployersTable />
            <Space h='l' />
            <Center>
                <Create />
            </Center>
        </>
    );
}
