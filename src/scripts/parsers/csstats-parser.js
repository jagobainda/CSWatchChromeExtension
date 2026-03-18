const parseCSStatsBase = (html) => {
    if (!html) return null;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const result = {
            csgo: null,
            cs2: { last_rank: undefined, best_rank: undefined }
        };

        const headers = doc.querySelectorAll(".header");
        let csgoSection = null;

        headers.forEach(header => {
            const csgoImg = header.querySelector('img[src*="logo-csgo.png"]');
            if (csgoImg) csgoSection = header.nextElementSibling;
        });

        if (csgoSection && csgoSection.classList.contains("ranks")) {
            result.csgo = { last_rank: undefined, best_rank: undefined, wins: undefined };

            const rankElement = csgoSection.querySelector(".rank img");
            if (rankElement) {
                const match = rankElement.getAttribute("src")?.match(/\/ranks\/(\d+)\.png/);
                if (match) result.csgo.last_rank = match[1];
            }

            const bestElement = csgoSection.querySelector(".best img");
            if (bestElement) {
                const match = bestElement.getAttribute("src")?.match(/\/ranks\/(\d+)\.png/);
                if (match) result.csgo.best_rank = match[1];
            }

            const winsElement = csgoSection.querySelector(".wins b");
            if (winsElement) result.csgo.wins = winsElement.textContent.trim();
        }

        const cs2ratings = doc.querySelectorAll(".cs2rating span");
        if (cs2ratings[0]) {
            const main = cs2ratings[0].childNodes[0]?.textContent?.trim();
            const decimal = cs2ratings[0].querySelector("small")?.textContent?.trim()?.replace(',', '');
            if (main && decimal) result.cs2.last_rank = { main, decimal, total: main + decimal };
        }

        if (cs2ratings[1]) {
            const main = cs2ratings[1].childNodes[0]?.textContent?.trim();
            const decimal = cs2ratings[1].querySelector("small")?.textContent?.trim()?.replace(',', '');
            if (main && decimal) result.cs2.best_rank = { main, decimal, total: main + decimal };
        }

        return result;
    } catch (error) {
        console.error('Error parsing CSStats base HTML:', error);
        return null;
    }
};

const parseCSStatsCS2 = (html) => {
    if (!html) return null;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const result = {
            matches: undefined,
            kd: undefined,
            wr: undefined,
            hs: undefined,
            adr: undefined
        };

        const matches = doc.querySelector(".total-value");
        if (matches) result.matches = matches.textContent.trim();

        const kd = doc.querySelector(".stat-large span");
        if (kd) result.kd = kd.textContent.trim();

        doc.querySelectorAll(".stat-panel").forEach(panel => {
            const heading = panel.querySelector(".stat-heading")?.textContent?.trim();
            const valueDiv = panel.querySelector(".stat-value") || panel.querySelector("div:nth-of-type(2) > div:nth-of-type(2)");

            if (!valueDiv) return;

            const firstTextNode = Array.from(valueDiv.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

            if (!firstTextNode) return;

            const rawText = firstTextNode.textContent.trim();
            const numericValue = rawText.replace(/[^0-9.]/g, '');

            if (heading === "Win Rate" && numericValue) result.wr = numericValue + "%";
            if (heading === "HS%" && numericValue) result.hs = numericValue + "%";
            if (heading === "ADR" && numericValue) result.adr = numericValue;
        });

        return result;
    } catch (error) {
        console.error('Error parsing CSStats CS2 HTML:', error);
        return null;
    }
};