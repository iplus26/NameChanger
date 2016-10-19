// Electron
let app = require('electron').remote,
    dialog = app.dialog;

// Dep
let // fs = require('fs'),
    globals = require('./globals'),
    File = require('./file'),
    _ = require('./utils');

let panel = globals.panel

// Node referrences
let doc = document,
    addFileBtn = doc.querySelector('#add_file'),
    removeFileBtn = doc.querySelector('#remove_file'),
    clearFilesBtn = doc.querySelector('#clear_files');

addFileBtn.addEventListener('click', function() {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections']
    }, function(filenames) {

        console.log(`Opening files: ${ JSON.stringify(filenames) }`)

        if (filenames === undefined) {
            console.log('No file selected! ');
        } else {
            panel.addFiles(filenames.map((path) => File(path)))
        }
    });
});

removeFileBtn.addEventListener('click', function() {
    panel.removeSelectedFiles();
});

clearFilesBtn.addEventListener('click', function() {
    panel.removeAllFiles();
});

panel.events(function(node) {
    node.addEventListener('click', function(e) {
        let td = e.target, tr;
        let select = Array.from(node.querySelectorAll('.selected'));
        select.forEach((el) => _.removeClass(el, 'selected'));

        if (td && td.tagName.toUpperCase() === 'TD') {
            tr = td.parentNode;
            _.addClass(tr, 'selected');
        }
    });
});