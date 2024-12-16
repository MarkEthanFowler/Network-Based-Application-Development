const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'seller is required']},
    condition: {type: String, required: [true, 'condition is required'], enum: ['Near Mint', 'Lightly Used', 'Moderately Used', 'Heavily Used', 'Damaged']},
    price: {type: Number, required: [true, 'price is required'], min: 0.01},
    details: {type: String, required: [true, 'details is required']},
    image: {type: String, required: [true, 'image is required']},
    active: {type: Boolean, required: [true, 'active is required']},
    totalOffers: {type: Number, required: [true, 'totalOffers is required'], default: 0},
    maxOffer: {type: Number, required: [true, 'maxOffer is required'], default: 0}
});

//collection name is games in the database
module.exports = mongoose.model('Game', gameSchema);
