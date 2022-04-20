const { find } = require("../model/course");
const course = require("../model/course");

// retriveing the data of form database..............................

const formdetails = {
    data: async (req, res) => {
        try {
            let data = await course.findOne({ user: req.session.uniq, completed: false });
            console.log("Form data feeding DATA", data);
            if (data) {
                res.send(data);
            }
        }
        catch (err) {
            console.log("error >>>", err);
        }
    }
}

module.exports = formdetails;