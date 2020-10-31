import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import shortId from 'shortid';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 5000;

import userRoutes from './routes/user';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(res => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})

app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

app.post('/razorpay', async (req, res, next) => {
    try {
        const tp = Math.ceil(Number(req.body.totalPrice));
        const amount = tp * 100;
        const response = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: shortId.generate(),
            payment_capture: 1,
        })
        console.log(response);
        res.send({
            razorpay_key: process.env.RAZORPAY_KEY,
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.send({ success: false });
    }

});

// using Razaorpay web-hook (currently disabled)
// app.post('/verification',(req,res)=>{
//     const secret = process.env.RAZORPAY_VERIFICATION_SECRET;
//     const shasum = crypto.createHmac('sha256',secret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');

//     console.log(digest);
//     console.log(req.headers['x-razorpay-signature']);

//     if(digest === req.headers['x-razorpay-signature']){
//         console.log('Request is legid');
//         res.json({status: 'ok'});
//     } else{
//        res.status(502).send({status: 'error'});
//     }
// })

// app.get('/api/paypal/cid', (req, res) => {
//     res.send(process.env.PAYPAL_CLIENT_ID);
// });

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

app.listen(PORT, () => {
    console.log("server has started");
})
// const server = app.listen(PORT, () => {
//     console.log("server has started");
// })
// const io = require('./socket').init(server);
// io.on('connection',socket=>{   // executes when ever new clients get connected.
//     console.log('new client connected!')
// });
// fGxwryDxsqKtBPDNbcrttV0S