const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Email = require('./models/email');
const Product = require('./models/product');
const helpers = require('./helpers');

mongoose.connect('mongodb://localhost:27017/stockManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch(err => {
        console.log('Mongo connection error')
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    const error = req.query.error;
    res.render('products/index', { products, error });
})

app.patch('/products', async (req, res, next) => {
    try {
        const { _id } = req.body;

        if (req.body.price == null) throw new Error('Must include a price');
        if (req.body.quantity == null) throw new Error('Must include a quantity');

        const existingProduct = await Product.findById(_id);

        if (existingProduct == null) throw new Error(`Unable to update product ${_id}. \nProduct does not exist`);

        const mergedProduct = helpers.addStockToProduct(existingProduct, Number(req.body.price), Number(req.body.quantity));
        await Product.findByIdAndUpdate(_id, mergedProduct, { runValidators: true, new: true });
        res.redirect('/products');
    } catch (err) {
        next(err);
    }
})

app.post('/products/remove', async (req, res, next) => {
    try {
        const email = req.body.email;

        const matchingEmails = await Email.find({ email });
        console.log(`Matching Emails`, matchingEmails);
        if (matchingEmails.length > 0) {
            const ErrorMessage = `This email address: (${email}) has already removed a product, please use a different email address.`;
            return res.redirect(`/products?error=${encodeURIComponent(ErrorMessage)}`);
        }
        const newEmail = new Email({
            email,
        });
        console.log(`New Email`, email);
        await newEmail.save();

        const { _id } = req.body;
        const existingQuantity = await Product.findById(_id);
        req.body.quantity = existingQuantity.quantity - req.body.quantity
        await Product.findByIdAndUpdate(_id, req.body);

        res.redirect('/products');
    } catch (err) {
        next(err);
    }
})

app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect('/products')
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
    console.log('app listening on 3000')
})


