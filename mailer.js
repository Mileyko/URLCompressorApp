var nodemailer = require('nodemailer');
var EMAILFROM = 'hi.from.urlcom.press@gmail.com';
var HOSTNAME = 'http://localhost:8080/';

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAILFROM,
        pass: '55f8597ec9f47c43a7bd44e3'
    }
});

// make text of email
function makeEmailText(longURL, compressedURL,  _id) {
    var text = "Hi!\n\n";
    text += 'To delete compressed URL ' + compressedURL + ' ';
    text += 'of a long URL ' + longURL + ' ';
    text += 'go to this link ' + HOSTNAME + 'delete/' + _id;

    return text;
}

module.exports = {
    send: function (data, callback) {
        // init variables from data
        var longURL = data.body.longURL;
        var compressedURL = data.body.compressedURL;
        var emailTo = data.body.email;
        var _id = data.body._id;

        // set up options of email
        var mailOptions = {
            from: EMAILFROM,
            to: emailTo,
            subject: 'Link to delete compressed URL',
            text: makeEmailText(longURL, compressedURL, _id)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }

            return callback(error);
        });
    }
};