const showAutoflagged = () => {
    const container = document.getElementById('is-autoflagged');

    container.style.display = 'block';
};

const showBanned = (banReason) => {
    const container = document.getElementById('is-banned');

    container.innerText = `Banned for ${banReason}`;

    container.style.display = 'block';
};

const showFaceitFilter = () => {
    const container = document.getElementById('faceit-filter-button');

    container.style.display = 'block';
};