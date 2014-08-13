#!/usr/bin/env node

(function() {

    'use strict';

    var fs = require('fs'),
        path = require('path'),
        exec = require('child_process').exec,
        util = require('util'),
        readline = require('readline');

    var args = process.argv.slice(2),
        sourceFile = args[0] || '../../statics/themes/launchpad-default/src/main/webapp/static/themes/default/base.less',
        targetFile = args[1] || '../../statics/themes/launchpad-default/src/main/webapp/static/themes/default/base.css';

    var file,
        filesImported = [sourceFile],
        filesWatched = [];

    var colorize = function (str, color) {
        var colors = {
            red:    ['\x1B[31m', '\x1B[39m'],
            green:  ['\x1B[32m', '\x1B[39m'],
            yellow: ['\x1B[33m', '\x1B[39m'],
            blue:   ['\x1B[34m', '\x1B[39m']
        };

        return colors[color][0] + str + colors[color][1];
    };

    var watchFile = function (file, callback) {
        fs.watchFile(file, {
            persistent: true,
            interval: 500
        }, (function (fn) {
            return function (curr, prev) {
                if(+curr.mtime !== +prev.mtime) {
                    if (callback && typeof callback === 'function') {
                        callback.apply(this, [fn]);
                    }
                }
            };
        })(file));
    };

    var parseFile = function (file, callback) {

        if (!fs.existsSync(file)) {
            if (callback && typeof callback === 'function') {
                callback.apply(this);
            }
            return;
        }

        var stream = fs.createReadStream(file, { encoding: 'utf-8' });

        var lineReader = readline.createInterface({
            input: stream,
            output: {}
        });

        lineReader.on('line', function (line) {
            line.replace(/\@import\s*(url)?\s*\(?[\s\'\"]*(.*\.less)[\s\'\"]*\)?\s*\;?/gi, function () {
                var url = arguments[2];
                if (/.less$/.test(url)) {
                    var fileDir = file.substr(0, file.lastIndexOf('/') + 1);
                    filesImported.push(path.join(fileDir, url));
                }
            });
        });

        lineReader.on('close', function () {
            if (callback && typeof callback === 'function') {
                callback.apply(this);
            }
        });
    };

    var fileParsed = function () {
        filesWatched.push(filesImported.shift());
        if (filesImported.length) {
            parseFile(filesImported[0], fileParsed);
        } else {
            util.puts(colorize('Watching ' + filesWatched.length + ' .less file(s) for changes.' , 'blue'));
            for (var i in filesWatched) {
                watchFile(filesWatched[i], compile);
            }
        }
    };

    var compile = function (dirtyFile) {
        util.puts(colorize(' o Dirty file detected: ' + dirtyFile, 'yellow'));
        exec('lessc ' + sourceFile, {
            maxBuffer: 500 * 1024
        }, function (error, stdout, stderr) {
            if (error) {
                util.puts(colorize(' ✗ Error occured while compiling!', 'red'));
                util.puts(stderr);
            } else {
                fs.writeFile(targetFile, stdout);
                util.puts(colorize(' ✓ Less files compiled.', 'green'));
            }
        });
    };

    parseFile(filesImported[0], fileParsed);

}());

