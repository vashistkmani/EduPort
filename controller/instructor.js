const async = require("hbs/lib/async");
const course = require("../model/course");
const orders = require("../model/orders");
const becomeInstructor = require('../model/becomeInstructor');

let instructor = {
    // Rendering instrutor dashboard .................................
    instructorDashboard: async (req, res) => {
        var dash = [];
        let result = await course.find({ user: req.session.uniq });
        let courseNo = result.length;
        var data = [];
        for (let i of result) {
            let courseID = i._id;
            let order = await orders.find();
            var quantity = 0;
            for (let j of order) {
                let item = j.item;
                for (let k of item) {
                    if (String(courseID) == String(k.item)) {
                        quantity = quantity + Number(k.qty);
                    }
                }
            }
            let det = {
                courseID,
                quantity,
            }
            dash.push(det);
        }
        dash.sort(function (a, b) {
            return b.quantity - a.quantity;
        })
        for (let d of dash) {
            let courseDetails = await course.findOne({ _id: d.courseID });
            let courseTitle = courseDetails.courseTitle;
            let image = courseDetails.image;
            let price = (courseDetails.coursePrice - courseDetails.discountPrice) * d.quantity;
            let Data = {
                courseTitle,
                image,
                duration: courseDetails.courseTime,
                price,
                selling: d.quantity,
            }
            data.push(Data);
        }
        res.render("instructor-dashboard", { courseNo, data })
    },

    // Rendering instructor create course ............................
    instructorCreateCourse: async (req, res) => {
        res.render("instructor-create-course");
    },

    // rendering instructor manage course ...........................
    instructorManageCourse: async (req, res) => {
        if (req.query.course) {
            console.log(req.query);
            let result = await course.find({ courseTitle: { $regex: req.query.course, $options: '$i' }, user: req.session.uniq });
            res.render("instructor-manage-course", { result });
        } else {
            let result = await course.find({ user: req.session.uniq });
            res.render("instructor-manage-course", { result });
        }
    },

    //rendering page instructor order  ................................
    instructorOrder: async (req, res) => {
        let result = await orders.find({ user: req.session.uniq });
        res.render("instructor-order", { result });
    },

    //become instructor ....................................
    becomeInstructor: async (req, res) => {
        let data = new becomeInstructor({ user: req.session.uniq });
        await data.save();
        res.redirect('/');
    }

}

module.exports = instructor;