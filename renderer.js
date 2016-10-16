let app = require('electron').remote;
let dialog = app.dialog;

let fs = require('fs')

let addIcon = document.querySelector('.icons8-Add-File')

addIcon.addEventListener('click', function() {
    dialog.showOpenDialog(function(filenames) {
        if (filenames === undefined) {
            console.log('No file selected! ')
        } else {
            rename(filenames)
        }
    })
})

function rename(filenames) {
    console.log(filenames)
}