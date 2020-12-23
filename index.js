const eejs = require('ep_etherpad-lite/node/eejs/');

// replace the loading block with a nice spinner
exports.eejsBlock_loading =  function (hook_name, args, cb) {
    args.content = eejs.require('ep_bigbluebutton_patches/templates/spinner.html')
    return cb();
}

// remove import UI
exports.eejsBlock_importColumn = function (hook_name, args, cb) {
    args.content = ''
    return cb();
}