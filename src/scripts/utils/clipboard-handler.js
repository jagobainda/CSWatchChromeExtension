const copyCSRepStatsToClipboard = async () => {
    const kdRatio = document.getElementById('cs-rep-stats-kd-ratio');
    const timeToDamage = document.getElementById('cs-rep-stats-time-to-damage');
    const preaimDegree = document.getElementById('cs-rep-stats-preaim-degree');
    const aimRating = document.getElementById('cs-rep-stats-aim-rating');
    const winRate = document.getElementById('cs-rep-stats-win-rate');
    const riskRate = document.getElementById('cs-rep-stats-risk-rate');

    const userNickname = document.querySelector('.actual_persona_name');

    if (!kdRatio || !timeToDamage || !preaimDegree || !aimRating || !winRate || !riskRate) return;

    const stats = `Nickname: ${userNickname?.innerText ?? 'Unknown'} | K/D: ${kdRatio.innerText} | TTD: ${timeToDamage.innerText} | Preaim: ${preaimDegree.innerText} | Aim Rating: ${aimRating.innerText} | Win rate: ${winRate.innerText} | Risk rate: ${riskRate.innerText}`;

    try {
        await navigator.clipboard.writeText(stats);
    } catch (error) {
        console.error('Failed to copy CSRep stats to clipboard:', error);
    }
};

const copyCSStatsStatsToClipboard = async () => {
    const userNickname = document.querySelector('.actual_persona_name');
    const premiereCurrentElo = document.getElementById('csstats-stats-premiere-current-elo');
    const premiereBestElo = document.getElementById('csstats-stats-premiere-best-elo');
    const kd = document.getElementById('csstats-stats-kd');
    const winrate = document.getElementById('csstats-stats-winrate');
    const hs = document.getElementById('csstats-stats-hs');
    const adr = document.getElementById('csstats-stats-adr');
    const matches = document.getElementById('csstats-stats-matches');

    if (!kd || !winrate || !hs || !adr || !matches) return;

    const stats = [
        `Nickname: ${userNickname?.innerText ?? 'Unknown'}`,
        premiereCurrentElo ? `Premiere: ${premiereCurrentElo.textContent}` : null,
        premiereBestElo ? `Best: ${premiereBestElo.textContent}` : null,
        `K/D: ${kd.innerText}`,
        `Win rate: ${winrate.innerText}`,
        `HS: ${hs.innerText}`,
        `ADR: ${adr.innerText}`,
        `Matches: ${matches.innerText}`
    ].filter(Boolean).join(' | ');

    try {
        await navigator.clipboard.writeText(stats);
    } catch (error) {
        console.error('Failed to copy CSStats stats to clipboard:', error);
    }
};

const copyFaceitStatsToClipboard = async () => {
    const faceitNickname = document.getElementById('faceit-user-nickname');
    const elo = document.getElementById('faceit-stats-elo');
    const kd = document.getElementById('faceit-stats-kd');
    const winrate = document.getElementById('faceit-stats-winrate');
    const hs = document.getElementById('faceit-stats-hs');
    const matches = document.getElementById('faceit-stats-matches');

    if (!kd || !winrate || !hs || !matches) return;

    const stats = [
        `Nickname: ${faceitNickname?.innerText ?? 'Unknown'}`,
        elo ? `Elo: ${elo.innerText}` : null,
        `K/D: ${kd.innerText}`,
        `Win rate: ${winrate.innerText}`,
        `HS: ${hs.innerText}`,
        `Matches: ${matches.innerText}`
    ].filter(Boolean).join(' | ');

    try {
        await navigator.clipboard.writeText(stats);
    } catch (error) {
        console.error('Failed to copy Faceit stats to clipboard:', error);
    }
};