const eejs = require('ep_etherpad-lite/node/eejs/');

// Replaces the loading block with a nice spinner
exports.eejsBlock_loading =  function (hook_name, args, cb) {
    args.content = eejs.require('ep_bigbluebutton_patches/templates/spinner.html')
    return cb();
}

// Removes import UI
exports.eejsBlock_importColumn = function (hook_name, args, cb) {
    args.content = ''
    return cb();
}

// Sets exported file background to white
exports.stylesForExport = function(hook, padId, cb) {
    cb('body{background-color:white}');
}

// Sets export default file name
exports.exportFileName = function(hook, padId, cb) {
    cb('Shared_Notes');
}
