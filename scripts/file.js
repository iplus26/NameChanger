/**
 * TODO: Provide getter and setter methods separately. 
 *
 */


let _cache = (function() {
    let pathCache = {};
    return function(path, constructor) {
        let split = path.split('/'), i,
            p = pathCache; // A "pointer"

        for (i = 0; i < split.length; i++) {
            p[split[i]] = p = p[split[i]] || {};
        }

        return p = p.uuid ? p : constructor.call(p, split) // Don't use new opertor. It changes the referrence. 
    };
})();

let _elementCache = (function(ele, file) {
    let elementCache = {};
    return function() {
        return elementCache[ele] = elementCache[ele] || file
    }
})();

let _File = function(split) {
    this.name = split[split.length - 1];
    this.path = split.join('');
    this.uuid = Date.now();
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

module.exports = File;
