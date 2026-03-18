const displayAccountStats = (dataObject) => {
    const idleHours = document.getElementById('account-stats-idle-hours');
    const steamCreation = document.getElementById('account-stats-steam-creation');
    const faceitCreation = document.getElementById('account-stats-faceit-creation');
    const difference = document.getElementById('account-stats-creation-difference');

    if (idleHours) idleHours.innerText = dataObject.idleHours;
    if (steamCreation) steamCreation.innerText = dataObject.steamCreationDate;
    if (faceitCreation) faceitCreation.innerText = dataObject.faceitCreationDate;
    if (difference) difference.innerText = dataObject.dateDifference;
};