const showError = (containerId, message) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const error = document.createElement('p');
    error.innerText = message;

    container.replaceChildren(error);
};

const showErrorCSRep = (message) => showError(CONSTANTS.CONTAINER_IDS.CSREP, message);
const showErrorCSStats = (message) => showError(CONSTANTS.CONTAINER_IDS.CSSTATS, message);
const showErrorFaceit = (message) => showError(CONSTANTS.CONTAINER_IDS.FACEIT, message);
