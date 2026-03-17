const copyCSRepStatsToClipboard = async () => {
    const kdRatio = document.getElementById('cs-rep-stats-kd-ratio');
    const timeToDamage = document.getElementById('cs-rep-stats-time-to-damage');
    const preaimDegree = document.getElementById('cs-rep-stats-preaim-degree');
    const aimRating = document.getElementById('cs-rep-stats-aim-rating');
    const winRate = document.getElementById('cs-rep-stats-win-rate');
    const riskRate = document.getElementById('cs-rep-stats-risk-rate');

    const userNickname = document.querySelector('.actual_persona_name');

    if (!kdRatio || !timeToDamage || !preaimDegree || !aimRating || !winRate || !riskRate) return

    const stats = `Nickname: ${userNickname.innerText} | K/D: ${kdRatio.innerText} | TTD: ${timeToDamage.innerText} | Preaim: ${preaimDegree.innerText} | Aim Rating: ${aimRating.innerText} | Win rate: ${winRate.innerText} | Risk rate: ${riskRate.innerText}`;

    await navigator.clipboard.writeText(stats);
};

const copyCSStatsStatsToClipboard = async () => {
    // TODO

    const stats = `CSStats.gg stats copying is not yet implemented.`;

    await navigator.clipboard.writeText(stats);
};

const copyFaceitStatsToClipboard = async () => {
    // TODO

    const stats = `Faceit stats copying is not yet implemented.`;

    await navigator.clipboard.writeText(stats);
};