//--------required modoles.............................
require('./config/database');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const route = require('./router/router');
const session = require('./middleware/session');
const helpers = require('./middleware/helper');
const async = require('hbs/lib/async');


//----------- static path ................................
const staticpath = path.join(__dirname, 'public');
app.use(express.static(staticpath));

//--------------- templete engine ............................
const viewpath = path.join(__dirname, 'view');
const partialpath = path.join(__dirname, 'public/partials');
app.set('view engine', 'hbs');
app.set('views', viewpath)
hbs.registerPartials(partialpath);

// ----------------helper-----------------
for (let helper in helpers) {
    hbs.registerHelper(helper, helpers[helper]);
}

hbs.registerHelper('condition', function (_id, session, options) {
    let result = session.filter(element => element.item == String(_id));
    if (result.length > 0) {
        let id;
        for (let i of result) {
            id = i.item;
        };
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});

// ----------------- session ----------------
app.use(session);

//---- parser -------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//------------- Route -------------------------------
app.use(route);

//--------------- server .......................
const port = 3000;
app.listen(port, () => {
    console.log(`Server = http://localhost:${port}`)
})