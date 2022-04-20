// ------------- required module --------------------------------------
const async = require("hbs/lib/async");
const course = require("../model/course");
const cartdb = require("../model/cart");
const user = require("./user");
const { ObjectId } = require('mongodb');


// -------------------------- controller -----------------------
let cartController = {
    //Adding to cart....................
    cartItem: async (req, res) => {
        var Cart = [];
        if (req.session.cart) {
            Cart = req.session.cart;
        }
        let item = {
            item: ObjectId(req.body.item),
            qty: Number(req.body.qty),
        }
        Cart.push(item);
        req.session.cart = Cart;
        console.log("item added to cart.");
        // req.session.destroy();
        res.send(req.body.item);
    },
    // Cart Page manage ---------------------------------------------
    cart: async (req, res) => {
        if (req.session.cart) {
            var cartItem = [];
            var total = 0;
            var OriginalPrice = 0;
            var Discount = 0;
            let cart = req.session.cart;

            // Find item From database with item ID.............................
            for (let i of cart) {
                let id = i.item;
                let Coursess = await course.findOne({ _id: id });
                if (i.qty) {
                    Coursess.quantity = i.qty;
                }
                cartItem.push(Coursess);
            };

            // Conting amount of item added to cart ...........................
            for (let i of cartItem) {
                let courseprice = i.coursePrice * i.quantity;
                OriginalPrice = OriginalPrice + courseprice;
                let discountprice = i.discountPrice * i.quantity;
                Discount = Discount + discountprice;
            };
            total = OriginalPrice - Discount;

            // saving data to database while user is login .............................
            if (req.session.isAuth) {
                const userID = req.session.uniq;
                let item = req.session.cart;
                try {
                    let result = await cartdb.findOne({ user: userID });
                    if (result) {
                        await cartdb.findOneAndUpdate({ user: userID }, { $set: { item: item } });
                        console.log('updated value');
                    }
                    else {
                        let DATA = new cartdb({ user: userID, item: item });
                        await DATA.save();
                        console.log("new Database Created");
                    }
                }
                catch (err) {
                    console.log("Error got .....");
                }
            }
            let quantity = {
                OriginalPrice,
                Discount,
                total,
            }
            req.session.quantity = quantity;
            res.render("cart", { cartItem, total, OriginalPrice, Discount });
        }
        else {
            res.render("cart");
        }
    },
    // Removing item from cart ............................................
    removeItem: async (req, res) => {
        let Cart = [];
        if (req.session.cart) {
            Cart = req.session.cart;
        }
        let id = req.body.id;
        let index = Cart.findIndex(i => i.item == id);
        Cart.splice(index, 1);
        req.session.cart = Cart;
        let length = (req.session.cart).length;
        // cart total ---------------------------------------------
        var cartItem = [];
        var total = 0;
        var OriginalPrice = 0;
        var Discount = 0;
        let cart = req.session.cart;
        // Find item From database with item ID.............................
        for (let i of cart) {
            let id = i.item;
            let Coursess = await course.findOne({ _id: id });
            if (i.qty) {
                Coursess.quantity = i.qty;
            }
            cartItem.push(Coursess);
        };

        // Conting amount of item added to cart ...........................
        for (let i of cartItem) {
            let courseprice = i.coursePrice * i.quantity;
            OriginalPrice = OriginalPrice + courseprice;
            let discountprice = i.discountPrice * i.quantity;
            Discount = Discount + discountprice;
        };
        total = OriginalPrice - Discount;
        // saving data to database if user is login .............................
        if (req.session.isAuth) {
            const userID = req.session.uniq;
            let item = req.session.cart;
            try {
                let result = await cartdb.findOne({ user: userID });
                if (result) {
                    await cartdb.findOneAndUpdate({ user: userID }, { $set: { item: item } });
                    console.log('updated value')
                }
            }
            catch (err) {
                console.log("Error got .....");
            }
        }
        // responding data.......................
        let respond = {
            id: req.body.id,
            length,
            total,
            OriginalPrice,
            Discount
        }
        console.log("item removed successfully...");
        res.send(respond);
    },

    // Counting item number ................................
    itemNumber: async (req, res) => {
        if (req.session.cart) {
            let data = {
                length: req.session.cart.length,
            }
            res.send(data);
        }
        else {
            let data = {
                length: 0,
            }
            res.send(data);
        }
    },
    // Quantity management in cart. ;
    increase: async (req, res) => {
        let id = req.body.id;
        let data = req.session.cart;
        let index = data.findIndex(i => i.item == id);
        data[index].qty = Number(data[index].qty) + 1;
        req.session.cart = data;

        // cart total ---------------------------------------------
        var cartItem = [];
        var total = 0;
        var OriginalPrice = 0;
        var Discount = 0;
        let cart = req.session.cart;
        // Find item From database with item ID.............................
        for (let i of cart) {
            let id = i.item;
            let Coursess = await course.findOne({ _id: id });
            if (i.qty) {
                Coursess.quantity = i.qty;
            }
            cartItem.push(Coursess);
        };

        // Conting amount of item added to cart ...........................
        for (let i of cartItem) {
            let courseprice = i.coursePrice * i.quantity;
            OriginalPrice = OriginalPrice + courseprice;
            let discountprice = i.discountPrice * i.quantity;
            Discount = Discount + discountprice;
        };
        total = OriginalPrice - Discount;
        // saving data to database if user is login .............................
        if (req.session.isAuth) {
            const userID = req.session.uniq;
            let item = req.session.cart;
            try {
                let result = await cartdb.findOne({ user: userID });
                if (result) {
                    await cartdb.findOneAndUpdate({ user: userID }, { $set: { item: item } });
                    console.log('updated value')
                }
            }
            catch (err) {
                console.log("Error got .....");
            }
        }
        let quantity = {
            qty: data[index].qty,
            OriginalPrice,
            Discount,
            total,
        }
        req.session.quantity = quantity;
        res.send(quantity);
    },

    decrease: async (req, res) => {
        let id = req.body.id;
        let data = req.session.cart;
        let index = data.findIndex(i => i.item == id);
        if (data[index].qty > 1) {
            data[index].qty = Number(data[index].qty) - 1;
            req.session.cart = data;
        }

        // cart total ---------------------------------------------
        var cartItem = [];
        var total = 0;
        var OriginalPrice = 0;
        var Discount = 0;
        let cart = req.session.cart;
        // Find item From database with item ID.............................
        for (let i of cart) {
            let id = i.item;
            let Coursess = await course.findOne({ _id: id });
            if (i.qty) {
                Coursess.quantity = i.qty;
            }
            cartItem.push(Coursess);
        };

        // Conting amount of item added to cart ...........................
        for (let i of cartItem) {
            let courseprice = i.coursePrice * i.quantity;
            OriginalPrice = OriginalPrice + courseprice;
            let discountprice = i.discountPrice * i.quantity;
            Discount = Discount + discountprice;
        };
        total = OriginalPrice - Discount;

        // saving data to database if user is login .............................
        if (req.session.isAuth) {
            const userID = req.session.uniq;
            let item = req.session.cart;
            try {
                let result = await cartdb.findOne({ user: userID });
                if (result) {
                    await cartdb.findOneAndUpdate({ user: userID }, { $set: { item: item } });
                    console.log('updated value')
                }
            }
            catch (err) {
                console.log("Error got .....");
            }
        }

        let quantity = {
            qty: data[index].qty,
            OriginalPrice,
            Discount,
            total,
        }
        req.session.quantity = quantity;
        res.send(quantity);
    },

};





// exporting module ..............................
module.exports = cartController;