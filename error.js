(function(global) {
    var defaultConfig = {
        whiteList: [],
        blackList: [],
        stackdepth: 3,
        beanIcon: ''
    };

    function extend(obja, objb) {
        for (var keyI in objb) {
            obja[keyI] = objb[keyI];
        }
        return obja;
    }

    function queryString(obj) {
        var str = "";
        if (Object.prototype.toString.call(obj) === "[object Object]") {
            for (var keyI in obj) {
                if (Object.prototype.toString.call(obj[keyI]) === "[object String]") {
                    str += keyI + "=" + obj[keyI].replace(/[\r\n]/g, " =>") + "&";
                } else {
                    str += keyI + "=" + obj[keyI] + "&";
                }

            }
            if (str) {
                str = str.substring(0, str.length - 1); //删掉最后一个&;
            }
        }
        return str;
    }

    function monitor() {
        var _defaultConfig = _getConfig();
        var whitelist = _defaultConfig.whiteList;
        var whitelistLen = whitelist.length;
        var blacklist = _defaultConfig.blackList;
        var blacklistLen = blacklist.length;
        var beanIcon = _defaultConfig.beanIcon;
        global.onerror = function(msg, url, line, col, error) {
            if (msg !== "Script error." && !url) {
                return true;
            }
            for (var i = 0; i < blacklistLen; i++) {
                if (url.indexOf(blacklist[i]) !== -1) {
                    return true;
                }
            }
            for (var i = 0; i < whitelistLen; i++) {
                if (url.indexOf(whitelist[i]) !== -1) {
                    return true;
                }
            }
            setTimeout(function() {
                var data = {};
                //不一定所有浏览器都支持col参数
                col = col || (global.event && global.event.errorCharacter) || 0;
                data.url = url;
                data.line = line;
                data.col = col;
                data.msg = msg;
                if (!!error && !!error.stack) {
                    //如果浏览器有堆栈信息直接使用
                    data.msg = error.stack.toString();
                } else if (!!arguments.callee) {
                    //尝试通过callee拿堆栈信息
                    var ext = [];
                    var f = arguments.callee.caller;
                    var c = _defaultConfig.stackdepth;
                    while (f && (c-- > 0)) {
                        ext.push(f.toString());
                        if (f === f.caller) {
                            break; //如果有循环引用
                        }
                        f = f.caller;
                    }
                    data.msg = ext.join(',');
                }
                if (beanIcon) {
                    upload(data)
                } else {
                    (global.console && global.console.log(data));
                }
            }, 0);
        }
    }

    function config(obj) {
        defaultConfig = extend(defaultConfig, obj);
    }

    function _getConfig() {
        return defaultConfig;
    }

    function upload(data) {
        var _defaultConfig = _getConfig();
        if (typeof data !== 'object' || !_defaultConfig.beanIcon) {
            return;
        }
        data.timestamp = new Date().getTime();
        var img = new Image();
        img.onerror = img.onload = img.complete = function() {
            img = null;
        }
        img.src = _defaultConfig.beanIcon + '?' + queryString(data);
    }

    if (typeof define === 'function' && define.amd) {
        define('error', [], function() {
            return {
                config: config,
                monitor: monitor
            };
        });
    } else if (typeof define === 'function' && define.cmd) {
        define(function() {
            return {
                config: config,
                monitor: monitor
            };
        })
    } else {
        global.$error = {
            config: config,
            monitor: monitor,
            upload: upload
        };
    }
})(this, undefined)
