// grab the mongoose module
var mongoose = require('mongoose');

// define model
module.exports = mongoose.model('url', {
    long: String, // Long URL
    compressed: String // Compressed URL
});