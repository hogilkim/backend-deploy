const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    picture : String
},{
    toJSON: {
        virtuals: true
    }
})

PictureSchema.virtual("picture_url").get(function(){ return `http://localhost:8000/files/${this.picture}`});

module.exports = mongoose.model('Picture', PictureSchema);