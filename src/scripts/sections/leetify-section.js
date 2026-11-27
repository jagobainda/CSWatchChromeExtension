const LEETIFY_METRICS = Object.freeze([
    { key: 'aimRating', label: 'Aim' },
    { key: 'timeToDamage', label: 'Time to damage' },
    { key: 'crosshairPlacement', label: 'Crosshair' },
    { key: 'kd', label: 'K/D' },
    { key: 'headshotKills', label: 'HS kill %' },
    { key: 'utilityRating', label: 'Utility' },
    { key: 'winRate', label: 'Win rate' },
    { key: 'spottedAccuracy', label: 'Accuracy' },
    { key: 'sprayAccuracy', label: 'Spray accuracy' },
    { key: 'counterStrafing', label: 'Counter strafing' }
]);

const getZScoreClass = (zScore) => (zScore === null ? null : `css-z-${zScore < 0 ? `n${-zScore}` : zScore}`);

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
            LEETIFY_METRICS.map(({ key, label }) =>
                createStat({
                    label,
                    value: data[key]?.value,
                    valueClass: getZScoreClass(data[key]?.zScore ?? null),
                    title: data[key]?.average && `Average: ${data[key].average}`
                })
            ),
            () => LEETIFY_METRICS.map(({ key, label }) => [label, data[key]?.value ?? CONSTANTS.PLACEHOLDER])
        );
    });

    return section.element;
};
