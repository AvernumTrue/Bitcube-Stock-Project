const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Emails = require('./models/emails');
const Product = require('./models/product');
const helpers = require('./helpers');

mongoose.connect('mongodb://localhost:27017/stockManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log("Mongo connection open")
    })
    .catch(err => {
        console.log("Mongo connection error")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.patch('/products', async (req, res, next) => {
    try {
        const { _id } = req.body;

        if (req.body.price == null) throw new Error('Must include a price');
        if (req.body.quantity == null) throw new Error('Must include a quantity');

        const existingProduct = await Product.findById(_id);
        if (existingProduct == null) throw new Error(`Unable to update product ${_id}. \nProduct does not exist`);

        const mergedProduct = helpers.addStockToProduct(existingProduct, Number(req.body.price), Number(req.body.quantity));
        const product = await Product.findByIdAndUpdate(_id, mergedProduct, { runValidators: true, new: true });
        res.redirect(`/products`);
    } catch (err) {
        next(err);
    }
})

app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/products`)
    } catch (err) {
        next(err);
    }
})

app.get('/products/new', (req, res, next) => {
    try {
        res.render('products/new', {})
    } catch (err) {
        next(err);
    }
})

app.patch('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`);
    } catch (err) {
        next(err);
    }
})

app.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (err) {
        next(err);
    }
})

app.listen(3000, () => {
    console.log("app listening on 3000")
})


