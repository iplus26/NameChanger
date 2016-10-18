/**
 * @constructor
 *
 * @private
 *
 */
let Panel = function(node) {
    this.element = node;
    this.list = node.querySelector('tbody');

    let sel = this;

    
};

Panel.prototype = {
    // addFile: function(file) {
    //     this.list.innerHTML += `<tr><td>${ file.name }</td></tr>`;
    // },
    addFiles: function(files) {
        this.list.innerHTML += files.map((file) => `<tr><td>${ file.name }</td></tr>`).join('');
    },
    removeSelectedFiles: function() {
        Array.from(this.list.querySelectorAll('.selected')).remove();
    },
    removeAllFiles: function() {
        this.list.innerHTML = ''
    },
    events: function(callback) {
        callback && callback(this.element, this.list)
    }
};


/**
 * @constructor
 *
 */
let PanelManager = function() {
    this._leftPanel  = new Panel(document.querySelector('#left_panel'));
    this._rightPanel = new Panel(document.querySelector('#right_panel'));
    this.panels = [this._leftPanel, this._rightPanel];
};


/** 
 * User manipulates the left panel. Panel manager updates the right panel.
 *
 */
Object.keys(Panel.prototype).forEach(function(method) {
    PanelManager.prototype[method] = function() {
        let args = arguments;
        this.panels.forEach(function(panel) {
            panel[method].call(panel, ...args);
        });
    };
});

module.exports = PanelManager;