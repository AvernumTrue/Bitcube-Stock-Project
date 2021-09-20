const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const Emails = mongoose.model('email', emailSchema);

module.exports = Emails;