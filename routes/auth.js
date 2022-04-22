const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');

// Register a new user
router.use('/register', async (req, res) => {
    if (req.body.username && req.body.email && req.body.password) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        });

        try {
            const saved = await newUser.save();
            console.log(saved);
            res.status(201).json(saved);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    } else {
        res.send('Missing username, email or password');
        alert('Missing username, email or password');
    }
});

// Login a user and return a JWT token
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json({ message: 'Username not found' });
        } else {
            const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            const { password, ...others } = user._doc;

            const access = JWT.sign(
                { id: user._id, isAdmin: user.isAdmin, },
                process.env.JWT_SEC, { expiresIn: "1h" });

            if (decrypted === req.body.password) {
                res.status(200).json({
                    message: 'Login successful',
                    user: others,
                    token: access
                });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;    // export the router so it can be used in index.js
