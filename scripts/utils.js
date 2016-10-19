let classCache = {};

let Utils = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass
};

Utils.uniqueId = (function() {
    let counter = 0;
    return function (node) {
        let id = node.getAttribute('tr-id');
        if (!id) {
            counter++;
            node.setAttribute('tr-id', counter);
            return counter + '';
        } else {
            return id;
        }
    }
})();

function hasClass(node, name) {
    if (!name) {
        return false;
    }
    return classRE(name).test(className(node));
}

function addClass(node, name) {
    if (!name) {
        return node;
    }
    if (!('className' in node)) {
        return;
    }
    let classList = [];
    let cls = className(node); // get node's className
    name.split(/\s+/g).forEach(function(klass) {
        if (!hasClass(node, klass)) {
            classList.push(klass);
        }
    })
    classList.length && className(node, cls + (cls ? ' ' : '') + classList.join(' '));
}

function removeClass(node, name) {
    if (!('className' in node)) {
        return;
    }
    if (name === undefined) {
        return className(node, '');
    }
    let cls = className(node);
    name.split(/\s+/g)
        .forEach((klass) => cls = cls.replace(classRE(klass), ' '));
    className(node, cls.trim());
}

function toggleClass(node, name) {
    if (!name) return node;
    return hasClass(node, name) ? removeClass(node, name) : addClass(node, name)
}

function classRE(name) {
    return name in classCache ?
        classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
}
// access className property while respecting SVGAnimatedString
function className(el, value) {
    var klass = el.className || '',
        svg = klass && klass.baseVal !== undefined;

    // get className
    if (value === undefined) {
        return svg ? klass.baseVal : klass;
    }

    // set className
    svg ? (klass.baseVal = value) : (el.className = value);
}

module.exports = Utils;