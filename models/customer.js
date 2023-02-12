const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema(
    {
        Useremail:{type:String},
        FullName:{type:String},
        Password:{type:String}
    },
    {
        versionKey: false
    }
)
const collection = new mongoose.model('User',CustomerSchema)
module.exports = collection