'use server';

import Prisma from '@/lib/prisma';

export async function getEmployers() {
    return await Prisma.employer.findMany();
}

type CreateEmployer = {
    name: string;
    workStart: number;
    workEnd: number;
    skills?: string[];
};

export async function createEmployer({
    name,
    workStart,
    workEnd,
}: CreateEmployer) {
    return await Prisma.employer.create({
        data: {
            name,
            workStart,
            workEnd,
        },
    });
}
