const showAutoflagged = () => {
    const container = document.getElementById('is-autoflagged');
    if (!container) return;

    container.style.display = 'block';
};

const showBanned = (banReason) => {
    const container = document.getElementById('is-banned');
    if (!container) return;

    container.innerText = `Banned for ${banReason}`;
    container.style.display = 'block';
};

const showFaceitFilter = () => {
    const container = document.getElementById('faceit-filter-button');
    if (!container) return;

    container.style.display = 'block';
};