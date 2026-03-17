const showErrorCSRep = (message) => {
    const container = document.getElementById('cs-rep-stats-container');

    if (!container) return;

    const error = document.createElement('p');

    error.innerText = message;

    container.innerHTML = '';
    container.appendChild(error);
};

const showErrorCSStats = (message) => {
    const container = document.getElementById('csstats-stats-container');

    if (!container) return;

    const error = document.createElement('p');

    error.innerText = message;

    container.innerHTML = '';
    container.appendChild(error);
};

const showErrorFaceit = (message) => {
    const container = document.getElementById('faceit-stats-container');

    if (!container) return;

    const error = document.createElement('p');

    error.innerText = message;

    container.innerHTML = '';
    container.appendChild(error);
};