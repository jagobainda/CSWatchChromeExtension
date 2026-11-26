const METRIC_TITLES = Object.freeze({
    leetifyRating: 'Leetify Rating',
    aimRating: 'Aim Rating',
    utilityRating: 'Utility Rating',
    crosshairPlacement: 'Crosshair Placement',
    timeToDamage: 'Time to Damage',
    headshotKills: 'Headshot Kill Percentage',
    spottedAccuracy: 'Accuracy (Enemy Spotted)'
});

const toShortText = (value) => (typeof value === 'string' && /^\S{1,12}$/.test(value) ? value : null);

const toZScore = (value) => (Number.isFinite(value) ? Math.max(-2, Math.min(2, Math.round(value))) : null);

const mapMetric = (metric) => {
    const value = toShortText(metric?.value);

    return value === null ? null : { value, zScore: toZScore(metric.zScore), average: toShortText(metric.avg) };
};

export const mapLeetifySummary = (summary) => {
    const { ratings, aimRatingSkills, aimAuxSkills, kdRatio, winRate } = summary ?? {};
    const metrics = [ratings, aimRatingSkills, aimAuxSkills].flatMap((list) => (Array.isArray(list) ? list : []));

    return {
        ...Object.fromEntries(Object.entries(METRIC_TITLES).map(([key, title]) => [key, mapMetric(metrics.find((metric) => metric?.title === title))])),
        kd: mapMetric(kdRatio),
        winRate: mapMetric(winRate)
    };
};
