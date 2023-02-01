const mongoose = require('mongoose')

const classroomSchema = mongoose.Schema(
    {
        classId: Number,
        ClassName:   String,
    },
    {
        versionKey: false
    }
)
module.exports = mongoose.model('classroom',classroomSchema)