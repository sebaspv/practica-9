require('dotenv').config();
const express = require('express')
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise')();

let cn;
if (process.env.DATABASE_URL) {
    cn = process.env.DATABASE_URL;
} else {
    cn = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'blog',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        allowExitOnIdle: true
    }
}

// Debug info (no secrets)
console.log('DATABASE_URL present?', !!process.env.DATABASE_URL, 'DB_SSL=', process.env.DB_SSL, 'NODE_ENV=', process.env.NODE_ENV);

// Enable SSL when requested or when using DATABASE_URL in production (Render requires TLS)
const shouldUseSSL = process.env.DB_SSL === 'true' || (process.env.DATABASE_URL && process.env.NODE_ENV === 'production');
if (shouldUseSSL) {
    // If cn is a connection string, convert to config object including ssl
    if (typeof cn === 'string') {
        cn = { connectionString: cn, ssl: { rejectUnauthorized: false } };
    } else {
        cn.ssl = { rejectUnauthorized: false };
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

const db = pgp(cn);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    store: new pgSession({
        pgPromise: db,
    }),
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000, secure: false },
}))

const authenticateSession = (req, res, next) => {
    if (req.session.id_author) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}


app.get('/hello', (req, res) => {
    res.json({ message: "Hola" });
});

app.get('/posts', (req, res) => {
    db.any('SELECT * FROM post')
        .then((data) => res.json(data))
        .catch((error) => console.log('ERROR: ', error))
})

app.get('/posts/:id_post'
    , (req, res) => {
        db.one('SELECT * FROM post WHERE id_post=$1'
            , [req.params.id_post])
            .then((data) => res.json(data))
            .catch((error) => console.log('ERROR:'
                , error));
    })

app.post('/posts/new', upload.single('img'), function (req, res) {
    const array = new Uint16Array(1);
    crypto.getRandomValues(array);
    const secureId = array[0];
    const imagePath = `/uploads/${req.file.originalname}`;
    db.none("INSERT INTO post (id_post, title, image) VALUES($1, $2, $3)", [secureId, req.body.title, imagePath])
        .then(() => res.send({
            message: 'Post agregado correctamente'
        }))
        .catch((error) => console.log('ERROR: ', error));
});

app.post('/login', upload.none(), (req, res) => {
    const { username, password } = req.body;

    db.oneOrNone("SELECT * FROM author WHERE username=$1",[username])
    .then((data) => {
        if (data != null){
            if (data.password == password){
                req.session.id_author = data.id_author;
                req.session.save(function(err) {
                    if (err) return next(err)
                })
                res.send(req.session);
            }
            else {
                res.status(401).send("Invalid email/password");
            }
        }
        else {
            res.status(401).send("Invalid credentials");
        }
    })
    .catch((error) => console.log("ERROR: ", error));
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Failed to destroy session");
        }
        res.send("Session destroyed");
    })
});

app.get("/session-info", (req, res) => {
    res.json(req.session);
});

app.get("/authors/:id_author", authenticateSession, (req, res) => {
    db.one("SELECT *, TO_CHAR(date_of_birth, 'DD/MM/YYYY') as date_of_birth FROM author WHERE id_author =$1", [req.params.id_author])
    .then((data) => res.json(data))
    .catch((error) => console.log("ERROR: ", error));
});


app.listen(process.env.SERVER_PORT || 8000, () => {
    console.log(`Servidor corriendo en puerto ${process.env.SERVER_PORT || 8000}`)
});
