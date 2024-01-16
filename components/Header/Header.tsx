'use client';

import { useState } from 'react';
import { Container, Group, Burger, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import Link from 'next/link';

const links = [
    { link: '/', label: 'Собеседования' },
    { link: '/employees', label: 'Сотрудники' },
    { link: '/skills', label: 'Доступные навыки' },
];

const Header = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className={classes.link}
            data-active={active === link.link || undefined}
            onClick={() => {
                setActive(link.link);
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <header className={classes.header}>
            <Container size='md' className={classes.inner}>
                <Title order={3}>HR сервис</Title>
                <Group gap={5} visibleFrom='xs'>
                    {items}
                </Group>

                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom='xs'
                    size='sm'
                />
            </Container>
        </header>
    );
};

export default Header;
