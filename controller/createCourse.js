const course = require('../model/course');

// instructor create course .......................................
const createCourse = {
    //generating new course id 
    newcourse: async (req, res) => {
        try {
            let uncompleted = await course.findOne({ user: req.session.uniq, completed: false });
            if (uncompleted) {
                if (uncompleted.user == req.session.uniq) {
                    let courseID = uncompleted._id;
                    req.session.courseId = courseID;
                }
            } else {
                let newCourse = new course({ user: req.session.uniq });
                let courseID = await newCourse.save();
                req.session.courseId = courseID;
            }
            res.send("Course Id Created");
        }
        catch (err) {
            console.log("ERROR ___________", err);
        }
    },

    // adding new course ........................
    courseDetails: async (req, res) => {
        const data = req.body;
        try {
            await course.findOneAndUpdate({ _id: req.session.courseId },
                {
                    $set: {
                        user: req.session.uniq,
                        courseTitle: data.courseTitle,
                        sortDescription: data.sortDescription,
                        courseCategory: data.courseCategory,
                        courseLevel: data.courseLevel,
                        language: data.language,
                        courseTime: data.courseTime,
                        totalLecture: data.totalLecture,
                        coursePrice: data.coursePrice,
                        discountPrice: data.discountPrice,
                    }
                },
                { new: true })
            console.log("course details save successfully.")
            res.status(200).send();
        }
        catch (err) {
            console.log("error got while saving course details ---", err);
            
        }
    },
    // inserting image of the course ............................
    insetImage: async (req, res,) => {
        try {
            let image = `http://localhost:3000/images/${req.file.originalname}`;
            await course.findOneAndUpdate({ _id: req.session.courseId }, { $set: { image: image } });
            console.log("save image to db successsfully.",);
            res.status(200).send();
        }
        catch (err) {
            console.log("error got while saving image ---", err);
        }
    },
    // Finalizing the course ...........................................
    finalsubmit: async (req, res) => {
        try {
            let data = req.body;
            let FAQ = data.FAQ;
            let tag = data.inputtag;
            let message = data.messagetoreviewer;
            await course.findOneAndUpdate({ _id: req.session.courseId },
                { $set: { FAQ, tag, message, completed: true } }, { new: true });
            console.log("Data Submit successfully.........");
            delete req.session['course'];
            delete req.session['courseId'];
            res.status(200).send();
        }
        catch {
            console.log("error got while final submit.", err);
        }
    },
    courseadded: async (req, res) => {
        res.render("course-added");
    }
};


// module export ...................
module.exports = createCourse;