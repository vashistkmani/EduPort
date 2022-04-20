//-------- module require -------------------------------------------------
const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const isAuth = require('../middleware/auth');
const multer = require('multer');

// multer image storage ....................
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        let filename = file.originalname;
        cb(null, filename);
    }
});

var upload = multer({ storage: storage });

// ---------------------- require controller ------------------------------
const homeController = require('../controller/homepage');
const userController = require('../controller/user');
const createCourse = require('../controller/createCourse');
const formdetails = require('../controller/formdetail');
const cartController = require('../controller/cart');
const paymentController = require('../controller/payment');
const instructorController = require('../controller/instructor');
const studentController = require('../controller/student');
const adminController = require('../view/admin');
const resetPassword = require('../middleware/mailer');

//------------------------- homepage  --------------------------------------
router.get('/', homeController.home);
router.get('/sign-in', homeController.signin);
router.get('/sign-up', homeController.signup);
router.get('/sign-out', homeController.signout);
router.get('/edit-Profile', isAuth, homeController.editProfile);
router.get('/become-instructor',isAuth,homeController.becomeInstructor);
router.get('/course-list',homeController.courseList);
router.get('/instructor-list',homeController.instructorList);
router.post('/courseDatatable', homeController.courseTable);
router.get('/forgot-password',homeController.forget);
router.post('/forgetPassword',resetPassword.forgetPassword);
router.get('/changePassword',resetPassword.reset);

// -------------------- instructor Routes ----------------------------------------
router.post('/become-instructor',instructorController.becomeInstructor);
router.get('/instructor-dashboard', isAuth, instructorController.instructorDashboard);
router.get('/instructor-create-course', isAuth, instructorController.instructorCreateCourse);
router.get('/instructormanagecourse', instructorController.instructorManageCourse);
router.get('/instructor-order', instructorController.instructorOrder);


// ---------- user controller   -----------------------------
router.post('/sign-up', userController.signup);
router.post('/sign-in', userController.signin);
router.get('/islogin', userController.islogin);
router.post('/edit-Profile', upload.single("image"), userController.editProfile);
router.post('/changePassword',userController.resetPassword);


//-------------------- instructorCreatecourse ------------------------------
router.post('/newCourse', createCourse.newcourse);
router.post('/instructor-create-course', createCourse.courseDetails);
router.post('/create-course', upload.single("my-image"), createCourse.insetImage);
router.post('/course', createCourse.finalsubmit);
router.get('/courseadded', createCourse.courseadded);

// ---------- get form details -----------------------------
router.get('/formdetails', formdetails.data);

// ------------ cart details ---------------------------
router.get('/cart', cartController.cart);
router.post('/cartAdd', cartController.cartItem);
router.post('/removeItem', cartController.removeItem);
router.get('/itemnumber', cartController.itemNumber);
router.post('/qtyinc', cartController.increase);
router.post('/qtydec', cartController.decrease);

// ------------------------- Student Routes ------------------------------------
router.get('/student-dashboard',isAuth,studentController.dashboard);
router.get('/student-order',isAuth,studentController.order);
router.get('/student-course-list',studentController.courselist);
router.post('/courseCancel',studentController.courseCancel)

// ---------------------------- admin route  ----------------------------------
router.get('/admin',adminController.index);
router.post('/admin-login',adminController.login);
router.get('/admin-course-list',adminController.courseList);
router.get('/admin-student-list',adminController.studentList);
router.get('/admin-instructor-list',adminController.instructorList);
router.get('/admin-instructor-request',adminController.instructorRequest);

// admin control -----------------------------------------
router.post('/requestAceept',adminController.instructorAccept);
router.post('/requestReject',adminController.instructorReject);

// -------------------- Payment details ----------------------------------------
router.get('/checkout', paymentController.checkout);
router.post('/create/orderId', paymentController.orderId);
router.post('/api/payment/verify', paymentController.paymenthandler);
router.post('/api/payment/failed', paymentController.paymentfailed);

// exports  -----------------------------
module.exports = router;