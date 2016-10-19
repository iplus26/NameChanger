let File = require('./file'),
    P;

//  Panel ---------------------------------------------------------------------
// 
let Panel = function(node, flag) {
    this.element = node;
    this.list = node.querySelector('tbody');
    this.flag = flag;
};

Panel.prototype = {
    addFiles: function(files) {
        let sel = this;

        files
            .filter((file) => !File.getElementByFile(file, sel.flag))
            .forEach(function(file) {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>${ file.name }</td>`;
                
                File.linkElementWithFile(tr, file, sel.flag)

                // Append element to list
                sel.list.appendChild(tr)
            })
    },
    removeAllFiles: function() {
        _removeFiles(this.list.querySelectorAll('tr'))
    },
    events: function(callback) {
        callback && callback(this.element)
    }
};


//  PanelManager ---------------------------------------------------------------------
//  User manipulates the left panel. Panel manager updates the right panel.
//
let PanelManager = function() {
    this._leftPanel  = new Panel(document.querySelector('#left_panel'), '_left');
    this._rightPanel = new Panel(document.querySelector('#right_panel'), '_right');
    this.panels = [this._leftPanel, this._rightPanel];
};

P = PanelManager.prototype;

['addFiles', 'removeAllFiles'].forEach(function(method) {
    P[method] = function() {
        let args = arguments;
        this.panels.forEach(function(panel) {
            panel[method].call(panel, ...args);
        });
    };
});

P.removeSelectedFiles = function() {
    let leftSelectedNodes = Array.from(this._leftPanel.list.querySelectorAll('.selected'))

    let parent = this._leftPanel.list,
        child  = Array.from(parent.children);
    let numbers = leftSelectedNodes.map(el => child.indexOf(el))

    let rightNodeList = this._rightPanel.list.querySelectorAll('tr')
    let rightSelectedNodes = Array.from(rightNodeList).filter((el, i) => numbers.includes(i))

    _removeFiles(leftSelectedNodes.concat(rightSelectedNodes))
}

P.events = function() {
    this._leftPanel.events.call(this._leftPanel, ...arguments)
}

P.updateByRule = function(wrap) {
    console.log(wrap)

    let right = this._rightPanel.list.querySelectorAll('tr');
    let left = this._leftPanel.list.querySelectorAll('tr');
    Array.from(right).forEach((el, i) => el.innerHTML = wrap(left[i].innerHTML))
}

function _removeFiles(nodelist) {
    let arr = Array.from(nodelist)

    arr.forEach(function(node) {
        File.removeElement(node)
    })
}

module.exports = PanelManager;