var crypto = require('crypto');
var PATH_LENGTH = 7;
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';
var charsLength = CHARS.length;
var URL = require('./app/models/URL');

module.exports = {

    // function returns random string of symbols with fixed length
    getKey: function () {
        var randomBytes = crypto.randomBytes(PATH_LENGTH);
        var result = "";
        var cursor = 0;

        for (var i = 0; i < PATH_LENGTH; i++) {
            cursor += randomBytes[i];
            result += CHARS[cursor % charsLength];
        }

        return result;
    },

    // check if path exists
    existsPath: function (path) {
        URL.count({compressed: path}, function (err, count) {
            return count > 0;
        })
    },

    // get path for compressed URL
    getPath: function () {
        var path;

        while (1) {
            path = this.getKey();

            if (this.existsPath(path))
                continue;

            break;
        }

        return path;
    }
};