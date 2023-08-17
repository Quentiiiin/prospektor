export enum Stat {
    PROSPECTS,
    REQUESTS,
    BLOCKED_REQUESTS,
}

const stats = new Map<Stat, number>();

export function addStat(category: Stat) {
    const current = stats.get(category);
    if(!current) {
        stats.set(category, 1);
        return;
    }
    stats.set(category, current + 1);
}

export function getStat(category: Stat): number{
    const current = stats.get(category);
    if(!current) {
        return 0;
    }
    return current;
}