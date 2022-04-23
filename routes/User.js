const router = require('express').Router();
const User = require('../models/User');
const { verifyTokenAuth, verifyTokenAndAdmin } = require('../routes/verifyToken');

router.get('/', (res) => {
    res.send('Hello from user');
});

router.get('/test', (res) => {
    res.send('Test GET request received');
});

router.post('/test', (req, res) => {
    const user = req.body.username
    res.send(`Test POST request received with username: ${user}`);
});

// READING USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find({}).limit(2) : await User.find({})
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/stats', verifyTokenAndAdmin, async (res) => {
    try {
        const users = await User.find({})
        const stats = {
            totalUsers: users.length,
            totalAdmins: users.filter(user => user.isAdmin).length,
            totalRegularUsers: users.filter(user => !user.isAdmin).length
        }
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// UPDATING USER
router.put('/:id', verifyTokenAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETING USER 
router.delete('/:id', verifyTokenAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;    // export the router so it can be used in index.js