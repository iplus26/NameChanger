let File = require('./file'),
    _ = require('./utils'),
    fs = require('fs'),
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

    let sel = this;

    // Delegate click events to the left panel
    this._leftPanel.element.addEventListener('click', function(e) {
        let td = e.target, tr;
        let select = Array.from(sel._leftPanel.element.querySelectorAll('.selected'));
        select.forEach((el) => _.removeClass(el, 'selected'));

        if (td && td.tagName.toUpperCase() === 'TD') {
            tr = td.parentNode;
            _.addClass(tr, 'selected');
        }
    });
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
    let right = this._rightPanel.list.querySelectorAll('tr');
    let left = this._leftPanel.list.querySelectorAll('tr');
    Array.from(right).forEach((el, i) => el.innerHTML = wrap(left[i].innerHTML))
}

P.exec = function() {
    let right = this._rightPanel.list.querySelectorAll('tr');
    let left = this._leftPanel.list.querySelectorAll('tr');
    Array.from(right)
        .forEach(function(el, i) {
            let new_name = el.querySelector('td').innerHTML

            // Replace file name
            let file = File.getFileByElement(el)
            let old_path = file.path
            let new_path = old_path.slice(0, old_path.length - file.name.length)
            new_path += new_name

            fs.rename(old_path, new_path, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    let new_file = File(new_path);

                    File.updateElement(el, new_file);
                    File.updateElement(left[i], new_file);
                    left[i].innerHTML = `<td>${ new_name }</td>`;
                }
            })
        })
}

function _removeFiles(nodelist) {
    let arr = Array.from(nodelist)

    arr.forEach(function(node) {
        File.removeElement(node)
    })
}

module.exports = PanelManager;