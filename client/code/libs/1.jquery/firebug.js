if(navigator.userAgent.toLowerCase().indexOf("firefox") == -1) {
    if (!window.console || !console.firebug) {
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

        window.console = {};
        for (var i = 0; i < names.length; ++i)
            window.console[names[i]] = function() {}
    }
}
