var fs = require('fs');
var path = require('path');
var debug = require('debug')('jsymfony:autoload:context');

function Context(namespace, target, parentContext) {
    this._namespace = namespace;
    this._target = target;
    this._parentContext = parentContext;

    this._fullNamespace = this._namespace;
    if (this._parentContext) {
        this._fullNamespace = this._parentContext.getFullNamespace() + '.' + this._fullNamespace;
    }

    this._childDirs = {};
}

Context.prototype.addDir = function (dir) {
    debug('Add dir %s to %s', dir, this._fullNamespace);

    dir = path.resolve(dir);

    var context = this;
    var target = this._target;

    var files = fs.readdirSync(dir);
    files.sort().reverse().forEach(function (file) {
        var fullPath = path.join(dir, file);
        var stat = fs.statSync(fullPath);

        var name = file;
        if (stat.isDirectory()) {
            context.addChildDir(name, fullPath);
            if (name in target) {
                return;
            }
        } else if (file.slice(-3) === '.js') {
            name = name.slice(0, -3);
            if (name in target) {
                return;
            }
        }
        var resolved;
        debug('Define %s.%s', context._fullNamespace, name);
        target.__defineGetter__(name, function () {
            if (typeof resolved !== 'undefined') {
                return resolved;
            }

            debug('Resolve %s.%s', context._fullNamespace, name);

            var resolvedModule = false;
            try {
                require.resolve(fullPath);
                resolvedModule = true;
            } catch(e) {
                debug('Could not resolve module %s.%s - created dummy object', context._fullNamespace, name);
            }

            var obj = resolvedModule ? require(fullPath) : {};

            resolved = obj;
            var newContext = new Context(name, obj, context);
            obj.__autoload = newContext;

            if (context._childDirs.hasOwnProperty(name)) {
                context._childDirs[name].forEach(function (dir) {
                    newContext.addDir(dir);
                });
            }

            return obj;
        });
    });
};

Context.prototype.getParentContext = function () {
    return this._parentContext;
};

Context.prototype.getFullNamespace = function () {
    return this._fullNamespace;
};

Context.prototype.addChildDir = function (name, dir) {
    if (!this._childDirs.hasOwnProperty(name)) {
        this._childDirs[name] = [dir];
        return;
    }

    if (this._childDirs[name].indexOf(dir) === -1) {
        this._childDirs[name].push(dir);
    }
};

module.exports = Context;
