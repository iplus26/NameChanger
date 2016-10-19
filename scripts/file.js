let Utils = require('./utils')

/**
 * TODO: Provide getter and setter methods separately. 
 *
 */
let _cache = (function() {
    let pathCache = {};
    window._cache = pathCache // for dev
    let ret = function(path, constructor) {
        let split = path.split('/'), i,
            p = pathCache; // A "pointer"

        for (i = 0; i < split.length; i++) {
            p[split[i]] = p = p[split[i]] || {};
        }

        return p = p.uuid ? p : constructor.call(p, split) // Don't use new opertor. It changes the referrence. 
    };
    ret.remove = function(file) {
        if (!file) return;

        try {
            let split = file.path.split('/'), i,
                p = pathCache;

            for (i = 0; i < split.length - 1; i++) {
                p = p[split[i]]
            }

            delete p[split[i]]
        } catch(e) {
            console.log(e)
        }

    }
    return ret;
})();

let _elementCache = (function() {
    let elementCache = {};
    window._elementCache = elementCache // for dev
    let ret = function(ele, file) {
        let id = Utils.uniqueId(ele)
        return elementCache[id] = elementCache[id] || file
    }
    ret.remove = function(ele) {
        delete elementCache[Utils.uniqueId(ele)]
    }
    return ret;
})();

let _File = function(split) {
    this.name = split[split.length - 1];
    this.path = split.join('/');
    this.uuid = Date.now(); // Not used so far
    return this
};

let File = function(path) {
    return _cache(path, _File);
};

File.getElementByFile = function(file, flag) {
    // console.log('getElementByFile: ' + file[flag + 'Element'])
    return file[flag + 'Element']
}

File.getFileByElement = function(ele) {
    return _elementCache(ele)
}

File.linkElementWithFile = function(ele, file, flag) {
    file[flag + 'Element'] = ele;
    return _elementCache(ele, file)
}

File.removeElement = function(ele) {
    // remove from file cache
    let file = this.getFileByElement(ele)
    _cache.remove(file)

    // remove from element cache
    _elementCache.remove(ele)

    // remove from dom
    ele.remove()
}

module.exports = File;
