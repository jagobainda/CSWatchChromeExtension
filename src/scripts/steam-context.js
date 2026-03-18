if (typeof g_rgProfileData !== 'undefined' && g_rgProfileData.steamid) {
    const steamIdSpan = document.createElement('span');
    steamIdSpan.id = 'steam-id-hidden';
    steamIdSpan.textContent = g_rgProfileData.steamid;
    steamIdSpan.style.display = 'none';
    document.body.appendChild(steamIdSpan);
}