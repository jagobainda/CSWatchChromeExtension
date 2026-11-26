const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (timestamp) => (timestamp === null ? 'Unknown' : new Date(timestamp).toISOString().slice(0, 10).split('-').reverse().join('-'));

const createAccountSection = (steamId, steamRequest, faceitRequest) => {
    const section = createSection({
        id: 'css-account',
        title: 'ACCOUNT STATS',
        href: `https://steamcommunity.com/profiles/${steamId}/badges/1`
    });

    section.load(Promise.allSettled([steamRequest, faceitRequest]), ([steam, faceit]) => {
        const steamCreation = steam.value?.memberSince ?? null;
        const faceitCreation = faceit.value?.activatedAt ?? null;
        const steamDate = formatDate(steamCreation);
        const faceitDate = formatDate(faceitCreation);
        const difference = steamCreation !== null && faceitCreation !== null ? `${Math.floor((faceitCreation - steamCreation) / DAY_MS)} days` : 'Unknown';

        section.render(
            [
                createStat({ label: 'Steam creation', value: steamDate, valueClass: 'css-text-csstats' }),
                createStat({ label: 'Faceit creation', value: faceitDate, valueClass: 'css-text-faceit' }),
                createStat({ label: 'Creation difference', value: difference })
            ],
            () => [
                ['Steam creation', steamDate],
                ['Faceit creation', faceitDate],
                ['Creation difference', difference]
            ]
        );
    });

    return section.element;
};
