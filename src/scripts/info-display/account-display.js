const displayAccountStats = (dataObject) => {
    const idleHours = document.getElementById('account-stats-idle-hours');
    const steamCreation = document.getElementById('account-stats-steam-creation');
    const faceitCreation = document.getElementById('account-stats-faceit-creation');
    const difference = document.getElementById('account-stats-creation-difference');

    idleHours.innerText = dataObject.idleHours;
    steamCreation.innerText = dataObject.steamCreationDate;
    faceitCreation.innerText = dataObject.faceitCreationDate;
    difference.innerText = dataObject.dateDifference;
};