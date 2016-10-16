// Electron
let app = require('electron').remote,
    dialog = app.dialog;

// Dep
let fs = require('fs'),
    _ = require('./utils');

// Node referrences
let doc = document,
    leftPanel = doc.querySelector('#left_panel'),
    list = doc.querySelector('#original_files_table'),
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
            addFiles(filenames);
        }
    });
});

removeFileBtn.addEventListener('click', function() {
    removeFiles();
});

clearFilesBtn.addEventListener('click', function() {
    list.querySelector('tbody').innerHTML = '';
});

function addFiles(filenames) {
    let str = filenames.map((el) => `<tr><td>${ el }</td></tr>`).join('');
    list.querySelector('tbody').innerHTML += str;
}

function removeFiles() {
    let select = list.querySelectorAll('.selected');
    Array.from(select).forEach((el) => el.remove());
}

// Delegate the events. 
leftPanel.addEventListener('click', function(e) {
    let td = e.target, tr;
    let select = Array.from(list.querySelectorAll('.selected'));
    select.forEach((el) => _.removeClass(el, 'selected'));

    if (td && td.tagName === 'TD') {
        tr = td.parentNode;
        _.addClass(tr, 'selected')
    }
});