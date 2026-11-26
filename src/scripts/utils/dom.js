const el = (tag, props, ...children) => {
    const element = document.createElement(tag);

    Object.entries(props ?? {}).forEach(([key, value]) => {
        if (value == null || value === false) return;

        if (key === 'className') element.className = value;
        else if (key === 'dataset' || key === 'style') Object.assign(element[key], value);
        else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), value);
        else element.setAttribute(key, value === true ? '' : value);
    });

    element.append(...children.flat().filter((child) => child != null && child !== false));

    return element;
};

const externalLink = (href, props, ...children) => el('a', { ...props, href, target: '_blank', rel: 'noopener noreferrer' }, ...children);
