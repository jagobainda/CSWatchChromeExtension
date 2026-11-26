const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const parseSteamMemberSince = (html) => {
    const match = html.match(/class="badge_description">\s*Member since (\d{1,2}) ([A-Za-z]+),? (\d{4})/);
    const month = MONTHS.indexOf(match?.[2]);

    return month >= 0 ? Date.UTC(Number(match[3]), month, Number(match[1])) : null;
};
