import express from 'express';
const router = express.Router();
import User from '../models/user';
import Product from '../models/product';
import jwt from 'jsonwebtoken';
import { isAuth, isAdmin } from '../middleware/Auth';

router.post('/register', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        const newUser = await user.save();
        if (newUser) {
            const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1 week' });
            res.send({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: token,
            });
        } else {
            res.send({ err: 'Invalid User Data!' });
        }
    } catch (err) {
        res.send({ err: err.message });
    }

})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        if (user) {
            const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token,
            });
        } else {
            console.log('usernotfound!');
            res.staus(400).send({ err: 'user not found!' });
        }
    } catch (err) {
        console.log(err);
        res.status(401).send({ err: err.message });
    }
})

router.put('/:id', isAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;
            const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1 week' });
            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: token,
            });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: 'Failed while Updating User!' });
    }

});


router.get('/createadmin', isAuth, isAdmin, async (req, res) => {
    try {
        const user = new User({
            name: 'kanav chadha',
            email: 'kanavchadha5@gmail.com',
            password: 'kanav246#',
            isAdmin: true,
        });
        const newUser = await user.save();
        res.send(newUser);
    } catch (err) {
        res.send({ err: err.message });
    }
})

router.get('/mycart', isAuth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.product').execPopulate();
        // console.log(user.cart.items);
        return res.status(200).send({ data: user.cart.items });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
})

router.post('/addtocart/:id', isAuth, async (req, res) => {
    try {
        const prodId = req.params.id;
        const qty = req.body.qty;
        const prod = req.user.cart.items.findIndex(pi => {
            return prodId.toString() === pi.product.toString()
        })
        if (prod < 0) {
            req.user.cart.items.push({ product: prodId, qty: qty });
            await req.user.save();
            const usercart = await req.user.populate('cart.items.product').execPopulate();
            return res.status(200).send({ data: usercart.cart.items, message: 'Product added to Cart Successfully' });
        } else {
            const updateCartItems = [...req.user.cart.items];
            updateCartItems[prod].qty = qty;
            req.user.cart.items = updateCartItems;
            await req.user.save();
            const usercart = await req.user.populate('cart.items.product').execPopulate();
            return res.status(200).send({ data: usercart.cart.items, message: 'Quantity of Cart Product is Updated.' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

router.delete('/delfromcart/:id', isAuth, async (req, res) => {
    try {
        const prodId = req.params.id;
        const updatedCartItems = req.user.cart.items.filter(cp => cp.product.toString() !== prodId.toString());
        req.user.cart.items = updatedCartItems;
        await req.user.save();
        const user = await req.user.populate('cart.items.product').execPopulate();
        res.status(200).send({ data: user.cart.items, message: 'Product Deleted from Cart Successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

export default router;
