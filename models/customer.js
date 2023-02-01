const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema(
    {
        CustomerId: Number,
        FullName:   String,
        Address:    String
    },
    {
        versionKey: false
    }
)
module.exports = mongoose.model('customer',CustomerSchema)