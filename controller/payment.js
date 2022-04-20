const async = require('hbs/lib/async');
const Razorpay = require('razorpay');
const orders = require('../model/orders');
const User = require('../model/user');

// razorpay itegration ..................................
var instance = new Razorpay({
    key_id: 'rzp_test_E0fTT9CN0y5mwy',
    key_secret: 'yVleJwZ0mDT06K3WmaRt3LXN',
});


// payment controller -----------------------------------------------
const paymentController = {
    checkout: async (req, res) => {
        if (req.session.isAuth) {
            let data = req.session.quantity;
            res.render("checkout", { data });
        }
        else {
            req.session.checkout = true;
            res.redirect('/sign-in');
        }
    },

    orderId: async (req, res) => {
        var options = {
            amount: req.session.quantity.total * 100,
            currency: "INR",
            receipt: "rcpt1"
        };
        await instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
            }
            else {
                req.session.orderId = order.id;
                res.send({ order });
            }
        });
    },

    paymenthandler: async (req, res) => {
        try {
            let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

            var crypto = require("crypto");
            var expectedSignature = crypto.createHmac('sha256', 'yVleJwZ0mDT06K3WmaRt3LXN')
                .update(body.toString())
                .digest('hex');
            var response = { "signatureIsValid": "false" }
            if (expectedSignature === req.body.response.razorpay_signature) {
                response = { "signatureIsValid": "true" }
                let details = {
                    user: req.session.uniq,
                    orderId: req.session.orderId,
                    name: req.body.data.name,
                    email: req.body.data.email,
                    mobileNo: req.body.data.mobile,
                    country: req.body.data.country,
                    state: req.body.data.state,
                    address: req.body.data.address,
                    postalCode: req.body.data.postalCode,
                    item: req.session.cart,
                    orderSummary: req.session.quantity,
                    response: req.body.response,
                };
                console.log("data type of detais", typeof (details.mobileNo));
                let saving = new orders(details);
                await saving.save();
                console.log("Order Save Successfully");
                let delData = req.session;
                ['cart', 'checkout', 'quantity', 'orderId'].forEach(element => delete delData[element]);;
                req.session = delData;
                let user = await User.findOne({ _id: req.session.uniq });
                res.send({ response, user: user.instructor });
            }
        } catch (err) { console.error() }
    },

    paymentfailed: async (req, res) => {
        let details = {
            user: req.session.uniq,
            orderId: req.session.orderId,
            name: req.body.data.name,
            email: req.body.data.email,
            mobileNo: req.body.data.mobile,
            country: req.body.data.country,
            state: req.body.data.state,
            address: req.body.data.address,
            postalCode: req.body.data.postalCode,
            item: req.session.cart,
            orderSummary: req.session.quantity,
            response: req.body.response.error,
        };
        let saving = new orders(details);
        await saving.save();
        console.log("Failed Order Save Successfully");
    }
};

module.exports = paymentController;