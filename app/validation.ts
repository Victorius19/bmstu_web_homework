import { number2time, time2number } from '@/lib/utils';
import { getEmployers } from './employees/actions';

export function skillsValidation(
    value: string[],
    employers: Awaited<ReturnType<typeof getEmployers>>,
    interviewerName: string,
) {
    const interviewer = employers.find((el) => el.name === interviewerName);

    if (!interviewer) {
        return 'Собеседующего нет в БД';
    }

    const applicantSkills = value;
    const interviewerSkills = interviewer.skills.map((el) => el.title);

    const bothSkills = new Set([...applicantSkills, ...interviewerSkills]);

    const numberOfApplicantSkills = value.length;
    const numberOfSkillsThatTheInterviewerDoesNotKnow =
        bothSkills.size - interviewerSkills.length;

    if (
        numberOfSkillsThatTheInterviewerDoesNotKnow / numberOfApplicantSkills >
        0.2
    ) {
        return 'Собеседующий знает меньше 80% навыков собеседуемого';
    }

    return null;
}

export function interviewTimeValidation(
    start: string,
    duration: string,
    employers: Awaited<ReturnType<typeof getEmployers>>,
    interviewerName: string,
) {
    const interviewer = employers.find((el) => el.name === interviewerName);

    const newInterviewStart = time2number(start);
    const newInterviewEnd = time2number(duration);

    if (!interviewer) {
        return 'Собеседующего нет в БД';
    }

    // Проверяем, что собеседование укладывается в рабочий день интервьюера
    if (
        newInterviewStart < interviewer.workStart ||
        newInterviewStart + newInterviewEnd > interviewer.workEnd
    ) {
        return `Собеседование не укладывается в рабочий день собеседующего. Собеседование должно укладываться в временной промежуток с ${number2time(interviewer.workStart)} до ${number2time(interviewer.workStart)}`;
    }

    // Проверяем, что собеседование не пересекается с другими собеседованиями собеседующего
    const intersection = interviewer.interviews.find((el) => {
        const interviewStart = el.start;
        const interviewEnd = el.start + el.duration;

        if (
            (interviewStart >= newInterviewStart &&
                newInterviewStart <= interviewEnd) ||
            (interviewStart >= newInterviewEnd &&
                newInterviewEnd <= interviewEnd) ||
            (interviewStart < newInterviewStart &&
                newInterviewEnd > interviewEnd)
        ) {
            return true;
        }

        return false;
    });

    if (intersection) {
        return `Собеседование пересекается с другими собеседованиями собеседующего. Проверьте собеседование с ${intersection.applicant}`;
    }

    return null;
}
