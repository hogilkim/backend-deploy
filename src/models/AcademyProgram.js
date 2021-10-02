const mongoose = require('mongoose');

const AcademyProgramSchema = new mongoose.Schema({
    academy_id: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Academy'
    },
    city: String,
    program_name: String,
    program_type: {
        type: String,
        enum: ['WEEKLY', 'FIXED']
    },
    unit_price:[{
        period: Number,
        unit_price: Number
    }],
    age_group: String,
    hashtag: [String]

})

module.exports = mongoose.model('AcademyProgram', AcademyProgramSchema);