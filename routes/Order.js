const Order = require('../models/Order');
const { verifyTokenAuth, verifyTokenAndAdmin } = require('../routes/verifyToken');

const router = require('express').Router();

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

// CREATING ORDER
router.post('/', async (req, res) => {
    const order = {
        user: req.body.user,
        items: [
            {
                productId: req.body.productId,
                quantity: req.body.quantity,
            },
        ],
        totalPrice: req.body.totalPrice,
        createdAt: req.body.createdAt,
        addresse: req.body.addresse,
        status: req.body.status,
    };
    try {
        const newOrder = await Order.create(order);
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READING ORDER
router.get('/find/:userId', verifyTokenAuth, async (req, res) => {
    try {
        const order = await Order.findOne({ user: req.params.userId });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READING ALL ORDERS
router.get('/', verifyTokenAndAdmin, async (res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATING ORDER
router.put('/:id', verifyTokenAuth, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETING ORDER
router.delete('/:id', verifyTokenAuth, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET INCOME
router.get("/income", verifyTokenAndAdmin, async (res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;    // export the router so it can be used in index.js