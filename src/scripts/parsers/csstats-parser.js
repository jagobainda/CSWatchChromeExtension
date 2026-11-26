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

const nullIfEmpty = (object) => (Object.values(object).some((value) => value !== null) ? object : null);

const parseSeasonName = (html) => html?.match(/^\s*([^\s<][^<\r\n]{0,19}?)\s*</)?.[1] ?? null;

const parseCurrentSeason = (html) => {
    const cells = Object.fromEntries(
        html
            .split('class="pm-c"')
            .slice(1)
            .map((cell) => [cell.match(/class="k">([^<]+)</)?.[1], cell])
    );

    return {
        season: parseSeasonName(html.split('class="sec-s">')[1]),
        wins: toNumber(cells.Wins?.match(/class="num">([^<]+)</)?.[1]),
        current: parseRating(cells.Current),
        best: parseRating(cells.Best)
    };
};

const parsePastSeason = (html) => {
    const [, current, best] = html.split('class="rk-v"');

    return {
        season: parseSeasonName(html.split('class="nm">')[1]),
        wins: toNumber(html.match(/class="rk-w">([^<]*)</)?.[1]),
        current: parseRating(current),
        best: parseRating(best)
    };
};

const parsePremierSeasons = (html) => {
    const section = html.match(/class="sec-t">Premier<\/span>([\s\S]*?)(?=<div class="sec[\s"]|<\/div>\s*<script|$)/)?.[1];
    if (!section) return [];

    const [currentSeason, ...pastSeasons] = section.split(/class="rk-row[^"]*"/);

    return [parseCurrentSeason(currentSeason), ...pastSeasons.map(parsePastSeason)].filter(({ season, wins, current, best }) => season && [wins, current, best].some((value) => value !== null));
};

const parseCSGO = (html) => {
    const row = html.match(/class="rk-row is-legacy">([\s\S]*?)<\/div>/)?.[1];
    if (!row) return null;

    const [current, best] = [...row.matchAll(/class="rk-v">([\s\S]*?)<\/span>/g)].map((match) => match[1]);

    return nullIfEmpty({
        wins: toNumber(row.match(/class="rk-w">([^<]*)</)?.[1]),
        currentRank: parseRank(current),
        bestRank: parseRank(best)
    });
};

export const parseCSStatsBase = (html) => ({
    premierSeasons: parsePremierSeasons(html),
    csgo: parseCSGO(html)
});
