const toNumber = (text) => {
    const value = text?.trim().replace(/,/g, '');
    return value && /^\d+(\.\d+)?$/.test(value) ? Number(value) : null;
};

const parseRating = (html) => {
    const match = html?.match(/class="cs2rating[^>]*>\s*<span[^>]*>\s*(\d+)\s*(?:<small>,(\d{3})<\/small>)?/);
    return match ? Number(match[1] + (match[2] ?? '')) : null;
};

const parseRank = (html) => {
    const rank = Number(html?.match(/\/ranks\/(\d+)\.png/)?.[1]);
    return rank >= 1 && rank <= 18 ? rank : null;
};

const nullIfEmpty = (object) => Object.values(object).some(value => value !== null) ? object : null;

const parsePremier = (html) => {
    const block = html.match(/class="pm-now">([\s\S]*?)<\/span>\s*<\/div>\s*<\/div>/)?.[1];
    if (!block) return null;

    const cells = Object.fromEntries(
        block.split('class="pm-c"').slice(1).map(cell => [cell.match(/class="k">([^<]+)</)?.[1], cell])
    );

    return nullIfEmpty({
        wins: toNumber(cells.Wins?.match(/class="num">([^<]+)</)?.[1]),
        current: parseRating(cells.Current),
        best: parseRating(cells.Best)
    });
};

const parseCSGO = (html) => {
    const row = html.match(/class="rk-row is-legacy">([\s\S]*?)<\/div>/)?.[1];
    if (!row) return null;

    const [current, best] = [...row.matchAll(/class="rk-v">([\s\S]*?)<\/span>/g)].map(match => match[1]);

    return nullIfEmpty({
        wins: toNumber(row.match(/class="rk-w">([^<]*)</)?.[1]),
        currentRank: parseRank(current),
        bestRank: parseRank(best)
    });
};

export const parseCSStatsBase = (html) => ({
    premier: parsePremier(html),
    csgo: parseCSGO(html)
});

export const parseCSStatsStats = (html) => {
    const panel = (heading) => toNumber(html.match(new RegExp(`class="stat-heading">\\s*${heading}\\s*<[\\s\\S]{0,300}?>\\s*([\\d.,]+)`))?.[1]);

    return nullIfEmpty({
        matches: toNumber(html.match(/class="total-value">([^<]+)</)?.[1]),
        kd: toNumber(html.match(/class="stat-large"[^>]*>\s*<span[^>]*>([^<]+)</)?.[1]),
        winRate: panel('Win Rate'),
        hs: panel('HS%'),
        adr: panel('ADR')
    });
};
