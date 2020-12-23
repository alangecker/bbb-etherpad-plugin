function getSessionToken(location) {
  var params = (new URL(location)).searchParams;
  var sessionToken = params.get("sessionToken") || "missing";

  return sessionToken;
}

exports.documentReady = function (hook_name, args, cb) {
    const socketio = require("ep_etherpad-lite/static/js/socketio")

    // wrap connect() for adding the sessionToken to the query params
    const originalConnect = socketio.connect
    socketio.connect = function(etherpadBaseUrl, namespace = '/', options = {} ) {
        return originalConnect(etherpadBaseUrl, namespace, Object.assign({
            query: {
                sessionToken: getSessionToken(document.location)
            }
        }, options))
    }
    return cb();
}

exports.postAceInit = function (hook_name, args, cb) {
    // append the sessionToken on all paths
    var pad_root_path = new RegExp(/.*\/p\/[^\/]+/).exec(document.location.pathname) || clientVars.padId;
    var sessionToken = getSessionToken(document.location);
    var sessionTokenParam = "?sessionToken=" + sessionToken;

    $("#exporthtmla").attr("href", pad_root_path + "/export/html" + sessionTokenParam);
    $("#exportetherpada").attr("href", pad_root_path + "/export/etherpad" + sessionTokenParam);
    $("#exportplaina").attr("href", pad_root_path + "/export/txt" + sessionTokenParam);
    $("#exportworda").attr("href", pad_root_path + "/export/doc" + sessionTokenParam);
    $("#exportpdfa").attr("href", pad_root_path + "/export/pdf" + sessionTokenParam);
    $("#exportopena").attr("href", pad_root_path + "/export/odt" + sessionTokenParam);

    return cb();
}
