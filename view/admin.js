const async = require("hbs/lib/async");
const becomeInstructor = require("../model/becomeInstructor");
const course = require("../model/course");
const user = require('../model/user');

let adminController = {
    //rendering admin login index .....................
    index: async (req, res) => {
        res.render("admin-login");
    },

    // validating admin  ......................................
    login: async (req, res) => {
        if (req.body.userName === 'admin' && req.body.password === "admin") {
            res.redirect('/admin-course-list');
        } else {
            res.redirect('/admin');
        }
    },

    //rendering course list ................................................
    courseList: async (req, res) => {
        if (req.query.course) {
            console.log(req.query.course);
            let data = await course.find({ courseTitle: { $regex: `${req.query.course}`, $options: '$i' } }).populate('user');
            console.log(data);
            let totalCourse = data.length;
            let pendingCourse = data.filter(i => i.completed == false).length;
            let activeCourse = totalCourse - pendingCourse;
            res.render("admin-course-list", { data, totalCourse, activeCourse, pendingCourse });
        }
        else {
            let data = await course.find().populate('user');
            let totalCourse = data.length;
            let pendingCourse = data.filter(i => i.completed == false).length;
            let activeCourse = totalCourse - pendingCourse;
            res.render("admin-course-list", { data, totalCourse, activeCourse, pendingCourse });
        }
    },

    // rendering student list ......................................................
    studentList: async (req, res) => {
        let User = [];
        let data = await user.find();
        for (let i of data) {
            if (!i.instructor) {
                User.push(i);
            }
        }
        res.render("admin-student-list", { User });
    },

    // rendering instructor list .....................................................
    instructorList: async (req, res) => {
        let instructor = await user.find();
        let data = [];
        for (let i of instructor) {
            if (i.instructor) {
                var totalCourse = (await course.find({ user: i._id })).length;
                data.push({
                    instructor: i,
                    totalCourse,
                });
            }
        }
        res.render("admin-instructor-list", { data });
    },

    // rendering instructor details ...................................................
    instructorDetail: async (req, res) => {
        res.render("admin-instructor-detail");
    },

    // rendering instructor request ....................................................
    instructorRequest: async (req, res) => {
        let data = await becomeInstructor.find().populate('user');
        res.render('admin-instructor-request', { data });
    },

    // rendering admin review ..........................................................
    adminReview: async (req, res) => {
        res.render('admin-review');
    },

    // rendering admin setting .....................................................
    adminSetting: async (req, res) => {
        res.render('admin-setting');
    },

    // instructor request accept .............................................
    instructorAccept: async (req, res) => {
        await user.findOneAndUpdate({ _id: req.body.user }, { $set: { instructor: true } });
        await becomeInstructor.findOneAndDelete({ _id: req.body.id });
        res.send("done");
    },

    // instructor request accept .............................................
    instructorReject: async (req, res) => {
        await becomeInstructor.findOneAndDelete({ _id: req.body.id });
        res.send("done");
    }
}

module.exports = adminController;