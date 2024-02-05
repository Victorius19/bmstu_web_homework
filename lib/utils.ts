export function time2number(time: string) {
    return time.split(':').reduce((pV, cV) => pV + Number(cV), 0);
}
