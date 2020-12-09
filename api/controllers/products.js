const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find().select(
      'name price _id productImage'
    ); // You can leave out select since you are manualy setting the returned product info.

    const response = {
      count: allProducts.length,
      product: allProducts.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3001/products/' + product._id,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.addProduct = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  try {
    const savedProduct = await product.save();
    res.status(201).json({
      createdProduct: {
        _id: savedProduct._id,
        name: savedProduct.name,
        price: savedProduct.price,
        productImage: savedProduct.productImage,
        request: {
          type: 'GET',
          url: 'http://localhost:3001/products/' + savedProduct._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    if (product === null)
      return res
        .status(404)
        .json({ message: `No valid entry found for provided ID: ${id}` });
    res.status(200).json({
      _id: product._id,
      name: product.name,
      price: product.price,
      productImage: product.productImage,
      request: {
        type: 'GET',
        url: 'http://localhost:3001/products/',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateProduct = async (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  try {
    const updatedProduct = await Product.updateOne({ _id: id }, updateOps);

    if (updatedProduct.ok === 0)
      return res.status(400).json({ message: 'Bad Request' });

    res.status(200).json({
      message: 'Product Updated',
      request: {
        type: 'GET',
        url: 'http://localhost:3001/products/' + id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const deletedProduct = await Product.deleteOne({ _id: id });

    if (deletedProduct.n === 0)
      return res.status(400).json({ message: 'Bad Request' });

    res.status(202).json({
      message: 'Product deleted sccessfully.',
      request: {
        type: 'POST',
        description: 'If you want to create a product',
        body: { name: 'String', price: 'Number' },
        url: 'http://localhost:3001/products',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
