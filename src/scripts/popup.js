const REPOSITORY_URL = 'https://github.com/jagobainda/CounterStrikeStatsExtension';

document.body.append(
    el(
        'div',
        { className: 'container' },
        el('h1', { className: 'title' }, 'Counter-Strike Stats'),
        el('p', { className: 'description' }, 'Counter-Strike stats directly on Steam profiles.'),
        el('div', null, externalLink(REPOSITORY_URL, { className: 'btn btn-red' }, 'View Source Code')),
        el('p', { className: 'footer' }, 'Made by ', externalLink('https://jagoba.dev', null, 'jagoba.dev'))
    )
);
