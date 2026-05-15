const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));


app.get('/login/', (req, res) => {
    res.type('text/plain');
    res.send('l1zavetkns');
});


app.post('/insert/', async (req, res) => {
    const { login, password, URL } = req.body;

    if (!login || !password || !URL) {
        return res.status(400).send('Не переданы login, password или URL');
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

        res.send('Документ записан');
    } catch (error) {
        console.error('Ошибка:', error.message);
        try { await mongoose.disconnect(); } catch (e) {}
        res.status(500).send('Ошибка записи в базу данных');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port ' + port);
});