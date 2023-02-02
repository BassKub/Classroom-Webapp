const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema(
    {
        Useremail: String,
        FullName:  String,
        Password:  String
    },
    {
        versionKey: false
    }
)
module.exports = mongoose.model('User',CustomerSchema)