import Create from './components/Create/Create';
import { Center, Space } from '@mantine/core';
import SkillsTable from './components/SkillsTable/SkillsTable';

export default function Page() {
    return (
        <>
            <SkillsTable />
            <Space h='l' />
            <Center>
                <Create />
            </Center>
        </>
    );
}
