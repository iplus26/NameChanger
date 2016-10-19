// Electron
let app = require('electron').remote,
    dialog = app.dialog;

// Dep
let fs = require('fs'),
    globals = require('./globals'),
    File = require('./file');

let panel = globals.panel

// Node referrences
let doc = document,
    addFileBtn = doc.querySelector('#add_file'),
    removeFileBtn = doc.querySelector('#remove_file'),
    clearFilesBtn = doc.querySelector('#clear_files'),
    runBtn = doc.querySelector('#run');

addFileBtn.addEventListener('click', function() {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
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

runBtn.addEventListener('click', function() {
    panel.exec()
})