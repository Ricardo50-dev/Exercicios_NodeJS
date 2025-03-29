import express from "express"
import exphbs from "express-handlebars"
import session from "express-session"
import FileStoreFactory from "session-file-store"
import flash from "express-flash"
import conn from "./db/conn.js"
import os from "os"
import path from "path"
import Tought from "./models/Tought.js"
import User from "./models/User.js"
import toughtsRoutes from "./routes/toughtsRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import ToughtController from "./controllers/ToughtController.js"


// Inicializando FileStore
const FileStore = FileStoreFactory(session)
const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: path.join(os.tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    }),
)

// flash messages
app.use(flash());

app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.session.userid);

    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

//Rotas
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

conn.sync().then(() => {
    app.listen(3000)
}).catch((err) => console.log(err))
