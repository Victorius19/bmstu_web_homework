'use server';

import Prisma from '@/lib/prisma';

export async function getEmployers() {
    return await Prisma.employer.findMany({
        include: {
            skills: true,
            interviews: true,
        },
    });
}

interface ICreateEmployer {
    name: string;
    workStart: number;
    workEnd: number;
    skills: { id: number; title: string }[];
}

export async function createEmployer({
    name,
    workStart,
    workEnd,
    skills,
}: ICreateEmployer) {
    return await Prisma.employer.create({
        data: {
            name,
            workStart,
            workEnd,
            skills: {
                connect: skills,
            },
        },
        include: {
            skills: true,
            interviews: true,
        },
    });
}

interface IUpdateEmployer {
    id: number;
    name: string;
    workStart: number;
    workEnd: number;
    skillsConnect?: { id: number; title: string }[];
    skillsDisconnect?: { id: number; title: string }[];
}

export async function updateEmployer({
    id,
    name,
    workStart,
    workEnd,
    skillsConnect,
    skillsDisconnect,
}: IUpdateEmployer) {
    return await Prisma.employer.update({
        where: {
            id,
        },
        data: {
            name,
            workStart,
            workEnd,
            skills: {
                connect: skillsConnect,
                disconnect: skillsDisconnect,
            },
        },
        include: {
            skills: true,
            interviews: true,
        },
    });
}

interface IDeleteEmplyer {
    id: number;
}

export async function deleteEmployer({ id }: IDeleteEmplyer) {
    return await Prisma.employer.delete({
        where: {
            id,
        },
    });
}
