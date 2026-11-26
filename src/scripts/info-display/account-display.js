const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (timestamp) => timestamp === null
    ? 'Unknown'
    : new Date(timestamp).toISOString().slice(0, 10).split('-').reverse().join('-');

const displayAccountStats = ({ steamCreation, faceitCreation }) => {
    const values = {
        'account-stats-idle-hours': 'Coming soon',
        'account-stats-steam-creation': formatDate(steamCreation),
        'account-stats-faceit-creation': formatDate(faceitCreation),
        'account-stats-creation-difference': steamCreation !== null && faceitCreation !== null
            ? `${Math.floor((faceitCreation - steamCreation) / DAY_MS)} days`
            : 'Unknown'
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.innerText = value;
    });
};
