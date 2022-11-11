const eejs = require('ep_etherpad-lite/node/eejs/');
const fs = require('fs');
const OVERRIDE_CONFIG_PATH = '/etc/bigbluebutton/etherpad.json';
let override_config = null;

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

function addAccessControlHeader(req, res) {
    override_config.cluster_proxies.forEach((proxy_url) => {
        if (req.headers.origin == proxy_url) {
            res.header('Access-Control-Allow-Origin', proxy_url);
	    res.header('Access-Control-Allow-Credentials', 'true');
        }
    });
}

// load config file on startup
exports.expressConfigure = (hookName, args) => {
    if (fs.existsSync(OVERRIDE_CONFIG_PATH)) {
        override_config = JSON.parse(fs.readFileSync(OVERRIDE_CONFIG_PATH));
        if (override_config['cluster_proxies']) {
            args.app.use(function(req, res, next) {
                addAccessControlHeader(req, res);
                next();
            });
        }
    }
};

// pdf conversion is asynchronous. There is a custom callback to allow request
// modification.
// The Send notes to whiteboard function downloads the slides as PDF to the
// browser and uploads them to BBB again. For this scenario a CORS request is
// necessary to etherpad. This is allowed here.
exports.exportConvert = (hookname, args) => {
    if (override_config && override_config['cluster_proxies']) {
        addAccessControlHeader(args.req, args.res);
    }
};
