const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('OK');
});

app.get('/login/', (req, res) => {
    res.type('text/plain');
    res.send('l1zavetkns');
});

app.post('/size2json/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.json({ width: 0, height: 0 });
    }
    try {
        const metadata = await sharp(req.file.buffer).metadata();
        return res.json({ width: metadata.width || 0, height: metadata.height || 0 });
    } catch (error) {
        return res.json({ width: 0, height: 0 });
    }
});

app.post('/insert/', async (req, res) => {
    const { login, password, URL } = req.body;

    if (!login || !password || !URL) {
        return res.status(400).send('Missing fields');
    }

    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const userSchema = new mongoose.Schema({
            login: String,
            password: String
        });
        const User = mongoose.model('User', userSchema, 'users');

        const newUser = new User({ login, password });
        await newUser.save();

        await mongoose.disconnect();

        res.type('text/plain');
        res.send('Document inserted');
    } catch (error) {
        console.error(error.message);
        try { await mongoose.disconnect(); } catch (e) {}
        res.status(500).send('Database error');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port ' + port);
});
