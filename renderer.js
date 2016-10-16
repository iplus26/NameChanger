let app = require('electron').remote;
let dialog = app.dialog;
let fs = require('fs');

let leftPanel = document.querySelector('#left_panel');
let list = document.querySelector('#original_files_table');

let addFileBtn = document.querySelector('#add_file'),
    removeFileBtn = document.querySelector('#remove_file'),
    clearFilesBtn = document.querySelector('#clear_files');

addFileBtn.addEventListener('click', function() {
    dialog.showOpenDialog(function(filenames) {
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
    let str = filenames.map(function(el, i) {
        return `<tr><td>${ el }</td></tr>`;
    });

    list.querySelector('tbody').innerHTML += str;
}

function removeFiles() {
    let select = list.querySelectorAll('.selected');
    Array.from(select).forEach(function(el) {
        el.remove();
    })
}

// Delegate the events. 
leftPanel.addEventListener('click', function(e) {
    let td = e.target, tr, className;

    if (td && td.tagName === 'TD') {
        tr = td.parentNode;
        className = tr.className;
        if (className.includes('selected')) {
            tr.className = className.replace('selected', '');
        } else {
            tr.className += ' selected';
        }
    } else {
        let select = list.querySelectorAll('.selected');
        Array.from(select).forEach(function(el) {
            el.className = el.className.replace('selected', '');
        });
    }


});