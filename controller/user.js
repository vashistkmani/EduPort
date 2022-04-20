//---- requirment --------------------------------
const async = require("hbs/lib/async");
const bycrpt = require('bcryptjs');
const User = require('../model/user');
const cartdb = require('../model/cart');

let user = {
    // -------------------- signup -------------------------------
    signup: async (req, res) => {
        const { email, pass, passw } = req.body;
        if (pass == passw) {
            try {
                const password = await bycrpt.hash(passw, 10);
                const newuser = new User({ email, password });
                await newuser.save()
                console.log("user save successfully");
                req.session.newUser = true;
                res.redirect('/sign-in');
            }
            catch (err) {
                console.log("Error got while signup", err);
                res.redirect('/sign-up');
            }
        }
    },
    //---------------------- signin................................
    signin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await User.findOne({ email });
            if (result) {
                isMatch = await bycrpt.compare(password, result.password);

                //condtion matching ..................
                if (isMatch) {
                    req.session.isAuth = true;
                    req.session.uniq = String(result._id);

                    //check for new user ..........................................
                    if (req.session.newUser) {
                        console.log("inside the new user condition ")
                        return res.redirect('/edit-Profile');
                    } else {
                        let DATA = await cartdb.findOne({ user: String(result._id) });
                        // saving cart item to session after login ..........................
                        if (DATA) {
                            if (req.session.cart) {
                                let itemAdded = DATA.item;
                                let sessionCart = req.session.cart;
                                let newCart = itemAdded.concat(sessionCart);
                                req.session.cart = newCart;
                            }
                            else {
                                req.session.cart = DATA.item;
                            }
                        };
                    };
                    console.log("Login Successful");

                    // re directing back to checkout.
                    if (req.session.checkout) {
                        delete req.session['checkout'];
                        return res.redirect('/checkout');
                    }
                    else {
                        return res.status(200).redirect('/');
                    };
                }
                else {
                    console.log("Password didn't match");
                    return res.redirect("/sign-in");
                };
            }
            else {
                console.log("user not found");
                return res.redirect("/sign-in");
            };
        }
        catch (err) {
            console.log("Error while login", err);
            return res.redirect('/sign-in');
        }
    },

    // switching between signin and signout button .......................................
    islogin: async (req, res) => {
        if (req.session.isAuth) {
            let user = await User.findOne({ _id: req.session.uniq })
            let data = {
                login: true,
                user: user,
            }
            res.send(data);
        }
        else {
            let data = {
                login: false,
            }
            res.send(data);
        }
    },

    editProfile: async (req, res) => {
        try {
            let image = `http://localhost:3000/images/${req.file.originalname}`;
            let { firstName, lastName, userName, phoneNumber, location, aboutme, qualification } = req.body;
            await User.findOneAndUpdate({ _id: req.session.uniq }, { $set: { firstName, lastName, userName, phoneNumber, location, aboutme, image, qualification } }, { new: true });
            if (req.session.newUser) {
                delete req.session['newUser'];
            }
            res.redirect('/');
        }
        catch (err) {
            console.log("ERROR >>>", err);
        }

    },
    resetPassword: async (req, res) => {
        let { emaidId, OTP, newPassword } = req.body;
        let result = await User.findOne({ email: emaidId });
        if (OTP == result.randomPassword) {
            const password = await bycrpt.hash(newPassword, 10);
            await User.findOneAndUpdate({ email: emaidId }, { $set: { password: password } });
            res.send({ success: true });
        } else {
            res.send({ success: false })
        }
    }
};

module.exports = user;
