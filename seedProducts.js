const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/stockManager', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch(err => {
        console.log('Mongo connection error')
        console.log(err)
    })

const seedProducts = [
    {
        name: 'PRODUCT01',
        price: 1.11,
        quantity: 1
    },
    {
        name: 'PRODUCT02',
        price: 22.22,
        quantity: 20
    },
    {
        name: 'PRODUCT03',
        price: 333.33,
        quantity: 300
    },
]

module.exports = seedProducts;