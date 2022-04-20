const async = require("hbs/lib/async");
const { default: mongoose } = require("mongoose");
const course = require("../model/course");
const orders = require("../model/orders");

let studentController = {
    dashboard: async (req, res) => {
        var courseData = []
        let data = await orders.find({ user: req.session.uniq });
        for (let i of data) {
            for (let j of i.item) {
                while (j.qty > 0) {
                    let coursesss = await course.findOne({ _id: j.item });
                    courseData.push(coursesss);
                    j.qty--;
                }
            }
        }
        let totalCourses = courseData.length;
        res.render("student-dashboard", { totalCourses })
    },
    order: async (req, res) => {
        let result = await orders.find({ user: req.session.uniq });
        res.render("student-order", { result });
    },
    courselist: async (req, res) => {
        if (req.query.courseSearch) {
            let qry = req.query.courseSearch;
            var courseData = [];
            let data2 = await course.findOne({ courseTitle: { $regex: qry, $options: '$i' } });
            if (data2) {
                let data = await orders.find({ user: req.session.uniq });
                for (let i of data) {
                    for (let j of i.item) {
                        let coursesss = await course.findOne({ _id: j.item });
                        if (String(coursesss._id) == String(data2._id)) {
                            while (j.qty > 0) {
                                console.log("Matched");
                                courseData.push(coursesss);
                                j.qty--;
                            }
                        }
                    }
                }
                let totalCourses = courseData.length;
                res.render("student-course-list", { courseData, totalCourses });
            }
        } else {
            var courseData = [];
            let data = await orders.find({ user: req.session.uniq });
            for (let i of data) {
                for (let j of i.item) {
                    while (j.qty > 0) {
                        console.log(j);
                        let coursesss = await course.findOne({ _id: j.item });
                        coursesss.quantity = i._id;
                        console.log(coursesss);
                        courseData.push(coursesss);
                        j.qty--;
                    }
                }
            }
            res.render("student-course-list", { courseData });
        }
    },
    //canceling course....................
    courseCancel: async (req, res) => {
        console.log(req.body);
        let order = await orders.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId), 'item.item': mongoose.Types.ObjectId(req.body.id) }, { $inc: { 'item.$.qty': -1 } });
        console.log(order);
        res.send(req.body.id);
    },
};

module.exports = studentController;     