const Cart = require("../models/Cart");
const { verifyTokenAuth, verifyTokenAndAdmin } = require("../routes/verifyToken");

const router = require("express").Router();

//CREATING CART
router.post("/", verifyToken, async (req, res) => {
    const cart = new Cart({
        userId: req.user._id,
        products: [
            {
                productId: req.body.productId,
                quantity: req.body.quantity,
            },
        ],
    });
    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//READ USER CART
router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//READ ALL CARTS
router.get("/", verifyTokenAndAdmin, async (res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//UPDATING CART
router.put("/:id", verifyTokenAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETING CART
router.delete("/:id", verifyTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
