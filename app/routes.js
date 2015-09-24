var path = require('path');
var URL = require('./models/URL');
var compressor = require('../compressor');
var mailer = require('../mailer');

module.exports = function(app) {

    // SERVER ROUTES
    // route to handle all server requests

    // redirect request
    app.get('/:_id', function (req, res) {
        var _id = req.params._id;

        URL.findOne({compressed: _id}, function (err, ret) {
            if (ret) {
                res.redirect(ret.long);
            } else {
                res.status(500).sendFile(path.join(__dirname, '../client/views', 'redirect-failed.html'));
            }
        });
    });

    // delete request from email
    app.get('/delete/:_id', function (req, res) {
        var _id = req.params._id;

        // try to find compressed URL in existing
        URL.findOne({_id: _id}, function (err, ret) {

            //  if it exists try to delete it
            if (ret) {
                URL.remove({_id: _id}, function (err) {
                    if (err) {
                        res.status(500).sendFile(path.join(__dirname, '../client/views', 'delete-failed.html'));
                    } else {
                        res.sendFile(path.join(__dirname, '../client/views', 'delete-ok.html'));
                    }
                })
            } else {
                res.status(500).sendFile(path.join(__dirname, '../client/views', 'delete-failed-notfound.html'));
            }
        });
    });

    // post request to send email
    app.post('/send', function (req, res) {
        mailer.send(req, function (err) {
            if (err) {
                res.status(500).send();
            } else {
                res.send();
            }
        });
    });

    app.get('/api/url/exists/:_id', function (req, res) {
        var _id = req.params._id;

        URL.count({_id: _id}, function (err, count) {
            res.send(count > 0);
        });
    });

    // post request to create new compressed URL
    app.post('/api/url', function (req, res) {
        var longURL = req.body.longURL;
        var compressedURL = compressor.getPath();

        var url = new URL({long: longURL, compressed: compressedURL});
        url.save(function (err) {
            res.send({compressedURL: url.compressed, _id: url._id});
        });
    });

    // delete request to delete compressed URL
    app.delete('/api/url/:_id', function (req, res) {
        var _id = req.params._id;

        URL.remove({_id: _id}, function (err) {
            res.send();
        });
    });

    // FRONTEND ROUTES
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/views', 'index.html'));
    });
};