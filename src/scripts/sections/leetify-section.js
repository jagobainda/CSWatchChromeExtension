const LEETIFY_METRICS = Object.freeze([
    { key: 'leetifyRating', label: 'Leetify Rating' },
    { key: 'aimRating', label: 'Aim' },
    { key: 'utilityRating', label: 'Utility' },
    { key: 'kd', label: 'K/D' },
    { key: 'winRate', label: 'Win rate' }
]);

const getZScoreClass = (zScore) => zScore === null ? null : `css-z-${zScore < 0 ? `n${-zScore}` : zScore}`;

const createLeetifySection = (steamId, leetifyRequest) => {
    const section = createSection({
        id: 'css-leetify',
        title: 'LEETIFY',
        href: `https://leetify.com/app/profile/${steamId}`,
        logo: 'imgs/logos/leetify-logo.svg',
        emptyMessage: 'No Leetify data'
    });

    section.load(leetifyRequest, (data) => {
        section.render(
            LEETIFY_METRICS.map(({ key, label }) => createStat({
                label,
                value: data[key]?.value,
                valueClass: getZScoreClass(data[key]?.zScore ?? null),
                title: data[key]?.average && `Average: ${data[key].average}`
            })),
            () => LEETIFY_METRICS.map(({ key, label }) => [label, data[key]?.value ?? CONSTANTS.PLACEHOLDER])
        );
    });

    return section.element;
};
