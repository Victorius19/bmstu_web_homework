'use server';

import Prisma from '@/lib/prisma';

export async function getSkills() {
    return await Prisma.skill.findMany();
}

interface ICreateSkill {
    title: string;
}

export async function createSkill({ title }: ICreateSkill) {
    return await Prisma.skill.create({
        data: {
            title,
        },
    });
}

interface IDeleteSkill {
    id: number;
}

export async function deleteSkill({ id }: IDeleteSkill) {
    return await Prisma.skill.delete({
        where: {
            id,
        },
    });
}
