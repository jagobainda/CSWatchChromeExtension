document.body.append(el('div', { className: 'container' },
    el('h1', { className: 'title' }, 'CSWatch'),
    el('p', { className: 'description' }, 'Track Counter-Strike stats directly on Steam profiles with CSWatch!'),
    el('div', null, externalLink('https://github.com/jagobainda/CSWatchChromeExtension', { className: 'btn btn-red' }, 'View Source Code')),
    el('p', { className: 'footer' }, 'Made by ', externalLink('https://jagoba.dev', null, 'jagoba.dev'))
));
