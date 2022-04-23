const router = require('express').Router();
const Item = require('../models/Items');
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

// CREATING ITEM
router.post('/', async (req, res) => {
    const item = new Item({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        size: req.body.size,
        color: req.body.color
    });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READING ITEM
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READING ALL ITEMS
//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let items;

        if (qNew) {
            items = await Item.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            items = await Item.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            items = await Item.find();
        }
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATING ITEM
router.patch('/:id', verifyTokenAuth, async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETING ITEM
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;    // export the router so it can be used in index.js