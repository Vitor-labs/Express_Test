const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello from user');
});

router.get('/test', (req, res) => {
    res.send('Test GET request received');
});

router.post('/test', (req, res) => {
    const user = req.body.username
    res.send(`Test POST request received with username: ${user}`);
});



module.exports = router;    // export the router so it can be used in index.js