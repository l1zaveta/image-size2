const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.type('text/plain');
    next();
});


app.get('/', (req, res) => {
    res.send('OK');
});


app.get('/login/', (req, res) => {
    res.send('l1zavetkns');
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
