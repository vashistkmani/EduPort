const async = require('hbs/lib/async');
const nodemailer = require('nodemailer');
const user = require('../model/user');

let resetPassword = {
    forgetPassword: async (req, res) => {
        console.log("in reset password api ", req.body);
        let result = await user.findOne({ email: req.body.email });
        console.log(result);
        if (result) {
            console.log(result);
            let transporter = nodemailer.createTransport({
                host: 'smtpout.secureserver.net',
                secure: true,
                port: 465,
                auth: {
                    user:'', //input email Address,
                    pass:'' ,//input password,
                },
            });
            let randomPassword = Math.floor(1000 + Math.random() * 9000);
            await user.findOneAndUpdate({ email: req.body.email }, { $set: { randomPassword } });
            let info = await transporter.sendMail({
                from: '', //input email address
                to: req.body.email,
                subject: "Reset Password || EduPort",
                html: "<p> Your Registred email id : </p>" + req.body.email + "<p> Login Password :</p> " + randomPassword,
            });
            if (info.messageId) {
                console.log("Mail sent successfully", info.messageId);
            } else {
                console.log("mail not send");
            }
            res.send("done");
        }
    },
    reset: async (req, res) => {
        res.render("resetPassword")
    },
};
module.exports = resetPassword;