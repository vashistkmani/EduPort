const session = require("express-session");
const mongoDbSession = require('connect-mongodb-session')(session);

// saving session data to database................................
const storage = new mongoDbSession({
    uri: serverDB,
    collection: "mysession",
});
// generatin session and cookie.............................
module.exports = session({
    secret: "developbyvashistkumarmani",
    resave: false,
    saveUninitialized: true,
    store: storage,
    name: 'sessioncookie',
    cookie: {
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24,
    }
});