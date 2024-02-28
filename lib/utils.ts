export function time2number(time: string) {
    const [hours = 0, minutes = 0] = time.split(':').map((el) => Number(el));

    return hours * 60 + minutes;
}

export function number2time(time: number) {
    const hours = Math.floor(time / 60);

    return `${('0' + hours).slice(-2)}:${('0' + (time - hours * 60)).slice(-2)}`;
}
