const RATING_TITLES = Object.freeze({
    leetifyRating: 'Leetify Rating',
    aimRating: 'Aim Rating',
    utilityRating: 'Utility Rating'
});

const toShortText = (value) => typeof value === 'string' && /^\S{1,12}$/.test(value) ? value : null;

const toZScore = (value) => Number.isFinite(value) ? Math.max(-2, Math.min(2, Math.round(value))) : null;

const mapMetric = (metric) => {
    const value = toShortText(metric?.value);

    return value === null ? null : { value, zScore: toZScore(metric.zScore), average: toShortText(metric.avg) };
};

export const mapLeetifySummary = ({ ratings, kdRatio, winRate }) => {
    const ratingList = Array.isArray(ratings) ? ratings : [];

    return {
        ...Object.fromEntries(Object.entries(RATING_TITLES).map(([key, title]) => [key, mapMetric(ratingList.find(rating => rating?.title === title))])),
        kd: mapMetric(kdRatio),
        winRate: mapMetric(winRate)
    };
};
