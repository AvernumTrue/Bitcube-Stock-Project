const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/stockManager', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo connection open")
    })
    .catch(err => {
        console.log("Mongo connection error")
        console.log(err)
    })

const seedProducts = [
    {
        name: 'product01',
        price: 1.11,
        quantity: 10
    },
    {
        name: 'product02',
        price: 2.22,
        quantity: 20
    },
    {
        name: 'product03',
        price: 3.33,
        quantity: 30
    },
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })