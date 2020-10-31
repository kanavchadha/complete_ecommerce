import express from 'express';
import Order from '../models/order';
import { isAuth, isAdmin } from '../middleware/Auth';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
// import {getIO} from '../socket';

const router = express.Router();

router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user').sort({ createdAt: -1 });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong!!' });
  }
});
router.get("/mine", isAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

router.get("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id }).populate('orderItems.product');
    if (order) {
      res.send(order);
    } else {
      res.status(404).send("Order Not Found!")
    }
  } catch (err) {
    res.status(500).send("Something went Wrong!")
  }

});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    const deletedOrder = await order.remove();
    res.send(deletedOrder);
  } else {
    res.status(404).send("Order Not Found.")
  }
});

router.post("/", isAuth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });
  const newOrderCreated = await newOrder.save();
  res.status(201).send({ message: "New Order Created", data: newOrderCreated });
});

router.put('/setstatus/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found.' })
    }
    order.status = req.body.setStatus;
    if (req.body.setStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    await order.save();
    // getIO().emit('trackOrder',{action: 'update',currStatus: order.status});
    res.status(200).send({ currStatus: order.status });
  } catch (err) {
    console.log('inside catch block ', err);
    return res.status(500).send({ message: err.message })
  }

})

router.put("/:id/pay/:pm", isAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    console.log(req.body);
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment = {
      paymentMethod: req.params.pm,
      paymentResult: {
        payerID: req.body.payerID,
        orderID: req.body.orderID,
        paymentID: req.body.paymentID
      }
    }
    order.status = 'placed';
    const updatedOrder = await order.save();
    if (req.user) {
      req.user.cart.items = [];
      await req.user.save();
    }
    res.send({ message: 'Order Paid.', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order not found.' })
  }
});

router.get('/download-invoice/:id', isAuth, async (req, res) => {
  const orderId = req.params.id;
  try{
    const order = await Order.findById(orderId).populate('orderItems.product');
    if (!order) {
      return res.status(404).send({error: 'No Order Found!'});
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({error: 'Access Denied!'});
    }
    const invoiceName = 'invoice_' + orderId + '.pdf';
    const invoicePath = path.join('invoices', invoiceName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');

    const pdfDoc = new PDFDocument(); 
    pdfDoc.pipe(fs.createWriteStream(invoicePath)); // storing to correct path.
    pdfDoc.pipe(res);
    pdfDoc.fontSize(22).text('Amazona Order Invoice', { underline: true });
    // pdfDoc.fontSize(16).text('Title           Qty     Price');
    pdfDoc.text('--------------------------------');
    order.orderItems.forEach(prod => {
      pdfDoc.fontSize(14).text(prod.product.name + ' -        ' + prod.qty + '  X     ' + prod.product.price+' Rs');
    });
    pdfDoc.text('--------------------------------');
    pdfDoc.fontSize(16).text('Products Price = ' + order.itemsPrice + ' Rs');
    pdfDoc.fontSize(16).text('Shipping Price = ' + order.shippingPrice + ' Rs');
    pdfDoc.fontSize(16).text('Tax Price = ' + order.taxPrice + ' Rs');
    pdfDoc.fontSize(18).text('Total Amount = ' + order.totalPrice + ' Rs');

    pdfDoc.end();

  } catch(err){
    console.log(err);
    return res.status(500).send({ message: err.message })
  }
})

  export default router;