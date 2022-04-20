const async = require("hbs/lib/async");
const course = require("../model/course");
const user = require("../model/user");

// Home page controller ............................................
let homeController = {

    // Rendering home page ..............
    home: async (req, res) => {
        // filtering indexpage according to user.
        var Data = [];
        const result = await course.find().populate('user');
        for (let i of result) {
            if (i.user == req.session.uniq) {
                continue;
            }
            else {
                if (!i.completed) {
                    continue;
                } else {
                    Data.push(i);
                }
            }
        }
        res.locals.session = req.session.cart;
        res.status(200).render("index-1", { Data });
    },

    // Rendering signin page ....................................
    signin: async (req, res) => {
        if (req.session.isAuth) {
            req.session.destroy();
            res.render("sign-in");
        } else {
            res.render("sign-in");
        }
    },

    // Rendering signup page ....................................
    signup: async (req, res) => {
        if (req.session.isAuth) {
            req.session.destroy();
            res.render("sign-up");
        } else {
            res.render("sign-up");
        }

    },

    // redirecting to home page after signout........................
    signout: async (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            console.log("signout successfully..");
            res.redirect("/");
        });
    },

    // Profile editing..................................................
    editProfile: async (req, res) => {
        let data = await user.findOne({ _id: req.session.uniq });
        console.log(data);
        res.render("edit-profile", { data });
    },

    // Become instructor ....................................................
    becomeInstructor: async (req, res) => {
        res.render("become-instructor");
    },

    //rendering course list ......................................................
    courseList: async (req, res) => {
        let Data = await course.find().populate('user');
        let data = Data.filter(item => item.completed == true);
        res.render("course-list", { data });
    },

    // rendering instructor list ..................................................
    instructorList: async (req, res) => {
        if (req.query.instructor) {
            let instName = req.query.instructor.toLowerCase();
            let instructor = await user.find({ $or: [{ firstName: { $regex: instName, $options: '$i' } }, { lastName: { $regex: instName, $options: '$i' } }] });
            let data = instructor.filter(i => i.instructor == true);
            res.render("instructor-list", { data });
        } else {
            let instructor = await user.find();
            let data = instructor.filter(i => i.instructor == true);
            res.render("instructor-list", { data });
        }
    },

    // Course Datatable .........................................
    courseTable: async (req, res) => {
        try {
            let start = req.query.start;
            let len = req.query.length;
            let condition = {};
            let count = 1;
            course.countDocuments(condition).exec((err, rows) => {
                let totalFiltered = rows
                let data = [];
                course.find(condition)
                    .skip(Number(start))
                    .limit(Number(len))
                    .exec((err, row) => {
                        row.forEach((index) => {
                            if (index.completed) {
                                data.push({
                                    image: `<img src=${index.image} alt="no image found">`,
                                    courseTitle: index.courseTitle,
                                    courseCategory: index.courseCategory,
                                    language: index.language,
                                    coursePrice: index.coursePrice,
                                })
                                count++;
                            };
                            // console.log("data in araray", data);
                            if (count > row.length) {
                                let json_data = JSON.stringify({ data })
                                res.send(json_data);
                            };
                        })
                    })
            })
        }
        catch (err) {
            console.log("error in datatable", err);
        }
    },
    forget: async (req, res) => {
        res.render("forgot-password");
    },
    resetPassword: async (req, res) => {

        try {
            let result = await user.findOne({ email: req.body.email });
            console.log(result);
            if (result) {
                console.log(result);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

// module exports.................................................
module.exports = homeController;