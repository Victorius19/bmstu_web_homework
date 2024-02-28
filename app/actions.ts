'use server';

import Prisma from '@/lib/prisma';

export async function getInterviews() {
    return await Prisma.interview.findMany({
        select: {
            id: true,
            applicant: true,
            start: true,
            duration: true,
            interviewer: {
                select: {
                    name: true,
                    id: true,
                    workStart: true,
                    workEnd: true,
                    skills: true,
                    interviews: true,
                },
            },
            skills: true,
        },
    });
}

interface ICreateInterview {
    applicant: string;
    start: number;
    duration: number;
    interviewerId: number;
    skills: { id: number; title: string }[];
}

export async function createInterview({
    applicant,
    start,
    duration,
    interviewerId,
    skills,
}: ICreateInterview) {
    return await Prisma.interview.create({
        data: {
            applicant,
            start,
            duration,
            interviewerId,
            skills: {
                connect: skills,
            },
        },
        select: {
            id: true,
            applicant: true,
            start: true,
            duration: true,
            interviewer: {
                select: {
                    name: true,
                    id: true,
                    workStart: true,
                    workEnd: true,
                    skills: true,
                    interviews: true,
                },
            },
            skills: true,
        },
    });
}

interface IDeleteInterview {
    id: number;
}

export async function deleteInterview({ id }: IDeleteInterview) {
    return await Prisma.interview.delete({
        where: {
            id,
        },
    });
}

interface IUpdateInterview {
    id: number;
    applicant: string;
    start: number;
    duration: number;
    interviewerId: number;
    skillsConnect?: { id: number; title: string }[];
    skillsDisconnect?: { id: number; title: string }[];
}

export async function updateInterview({
    id,
    applicant,
    start,
    duration,
    interviewerId,
    skillsConnect,
    skillsDisconnect,
}: IUpdateInterview) {
    return await Prisma.interview.update({
        where: {
            id,
        },
        data: {
            applicant,
            start,
            duration,
            interviewerId,
            skills: {
                connect: skillsConnect,
                disconnect: skillsDisconnect,
            },
        },
        select: {
            id: true,
            applicant: true,
            start: true,
            duration: true,
            interviewer: {
                select: {
                    name: true,
                    id: true,
                    workStart: true,
                    workEnd: true,
                    skills: true,
                    interviews: true,
                },
            },
            skills: true,
        },
    });
}
