import { time2number } from '@/lib/utils';

export function nameValidation(value: string) {
    if (value.length <= 3 || value.length >= 35) {
        return 'Длинна ФИО должна быть от 4-х до 34-х символов';
    }

    if (!/^[А-Яа-я ]+$/.test(value)) {
        return 'ФИО заполняется кириллицей';
    }

    return null;
}

export function workTimeValidation(workStart: string, workEnd: string) {
    if (time2number(workEnd) - time2number(workStart) <= 0) {
        return 'Время конца рабочего дня не должно быть раньше начала';
    }

    return null;
}
