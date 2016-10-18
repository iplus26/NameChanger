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

        return p.uuid ? p : new constructor(split);
    };
})();

let _File = function(split) {
    this.name = split[split.length - 1];
    this.path = split.join('');
    this.uuid = Date.now();
};

let File = function(path) {
    return _cache(path, _File);
};

module.exports = File;
