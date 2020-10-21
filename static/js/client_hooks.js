function getSessionToken(location) {
  var params = (new URL(location)).searchParams;
  var sessionToken = params.get("sessionToken") || "missing";

  return sessionToken;
}

exports.documentReady = function (hook_name, args, cb) {
    
    // wrap io.connect to append the sessionToken
    var ioConnect = io.connect;
    var wrappedIoConnect = function (url, options) {
        if(!options) options = {};
        options['query'] = "sessionToken=" + getSessionToken(document.location);
        return ioConnect(url, options);
    }
    io.connect = wrappedIoConnect;

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
