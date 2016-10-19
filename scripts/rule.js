let globals = require('./globals')

let Rule = function() {}

let select = document.querySelector('#rule_select'),
    old_str = document.querySelector('#old_string'),
    new_str = document.querySelector('#new_string'),
    current = 0;

let config = [{
    value: 'Replace the first occurrence with',
    wrapper: (filename) => filename.replace(old_str.value, new_str.value)
}, {
    value: 'URL-Decode the file names',
    wrapper: (filename) => decodeURIComponent(filename)
}];

select.innerHTML = config.map(el => `<option>${ el.value }</option>`).join('')

select.addEventListener('change', function(e) {
    let rule = e.target.value;

    for (let i = 0; i < config.length; i++) 
        if (rule === config[i].value) {
            current = i;
            break;
        }

    globals.panel.updateByRule(config[current].wrapper)
});

['change', 'keyup', 'paste'].forEach(evt => [old_str, new_str].forEach((el) => el.addEventListener(evt, function(e) {
    globals.panel.updateByRule(config[current].wrapper);
})));

module.exports = Rule