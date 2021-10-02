const mongoose = require('mongoose');
const Picture = require('./Picture').schema;


const AcademySchema = new mongoose.Schema({
    name: String,
    company: String,
    telephone_number: String,
    address: String,
    email: String,
    city: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    nearby_amenity: String,
    description: String,
    rating: {type: Number, min: 0, max: 5},
    programs:[{
        type: mongoose.Schema.Types.ObjectId
    }]
    // ,
    // academy_pictures: [Picture]    
});


module.exports = mongoose.model('Academy', AcademySchema);