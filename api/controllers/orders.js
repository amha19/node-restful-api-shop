const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product', 'name price');
    res.status(200).json({
      count: orders.length,
      orders: orders.map((order) => {
        return {
          _id: order._id,
          productId: order.product,
          quantity: order.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3001/orders/' + order._id,
          },
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.addOrder = async (req, res, next) => {
  const id = req.body.productId;
  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({
        message: 'Invalied Product!',
      });

    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity,
    });

    await order.save();
    res.status(201).json({
      message: 'Order Created.',
      createdOrder: {
        _id: order._id,
        productId: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: 'http://localhost:3001/orders/' + order._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }

  //   Product.findById(req.body.productId)
  //     .exec()
  //     .then((product) => {
  //       if (product === null) {
  //         return res.status(404).json({
  //           message: 'Invalied Product!',
  //         });
  //       }
  //       const order = new Order({
  //         _id: mongoose.Types.ObjectId(),
  //         product: req.body.productId,
  //         quantity: req.body.quantity,
  //       });

  //       order.save().then((response) => {
  //         res.status(201).json({
  //           message: 'Order Created.',
  //           createdOrder: {
  //             _id: response._id,
  //             productId: response.product,
  //             quantity: response.quantity,
  //             request: {
  //               type: 'GET',
  //               url: 'http://localhost:3001/orders/' + response._id,
  //             },
  //           },
  //         });
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
};

exports.getOrder = async (req, res, next) => {
  const id = req.params.orderId;
  try {
    const order = await Order.findById(id).populate('product', 'name price');
    if (!order)
      return res.status(404).json({
        message: 'Product not found.',
      });

    res.status(200).json({
      _id: order._id,
      productId: order.product,
      quantity: order.quantity,
      request: {
        type: 'GET',
        url: 'http://localhost:3001/orders/',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteOrder = async (req, res, next) => {
  const id = req.params.orderId;
  try {
    const deletedOrder = await Order.deleteOne({ _id: id });

    if (deletedOrder.n === 0)
      return res.status(400).json({ message: 'Bad Request' });

    res.status(200).json({
      message: `Order with Id:${id} was deleted.`,
      request: {
        type: 'POST',
        url: 'http://localhost:3001/orders',
        body: { productId: 'ID', quantity: 'Number' },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
