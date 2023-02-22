const mongoose = require('mongoose')

const classroomSchema = mongoose.Schema(
    {
        classId: String,
        ClassName: String,
        Description: String,
        student : Array,
    },
    {
        versionKey: false
    }
)
const classes = new mongoose.model('classroom',classroomSchema)
module.exports = classes