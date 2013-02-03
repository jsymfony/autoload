var util = require('util');

var autoload = exports;
var Context = require('./Context');
var debug = require('debug')('autoload');

autoload.register = function (namespace, dir, root) {
    debug('Register namespace %s as dir %s', namespace, dir);
    root = root || global;

    var parts = namespace.split('.');

    var pointer = root;

    for (var i = 0; i < parts.length; i++) {
        var node = pointer[parts[i]];

        if (typeof node === 'undefined') {
            node = pointer[parts[i]] = {};
        }

        if (!this.isAutoloadProxy(node)) {
            node.__autoload = new Context(parts[i], node, this.isAutoloadProxy(pointer) ? pointer.__autoload : null);
        }
        pointer = node;
    }

    node.__autoload.addDir(dir);
};

autoload.isAutoloadProxy = function (obj) {
    if (typeof obj !== 'object') {
        return false;
    }

    return '__autoload' in obj;
};
