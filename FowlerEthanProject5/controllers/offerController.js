const Game = require('../models/game');
const offer = require('../models/offer');
const users = require('../models/user');

exports.index = (req, res, next) =>{
    let id = req.params.id;
    let user = req.params.user;
    offer.find({game: id}).populate('buyer', 'firstName lastName').populate('game', 'title')
    .then(offers=>{
        
        console.log(offers)
        
        res.render('./offer/offers', {offers});
    })
}

exports.create = (req, res, next) =>{
    
    let newOffer = new offer(req.body);
    newOffer.buyer = req.session.user;
    newOffer.game = req.params.id;
    let id = req.params.id;

    Promise.all([newOffer.save(), Game.findByIdAndUpdate(id, {$max: { maxOffer: newOffer.amount}}), Game.findByIdAndUpdate(id, {$inc: { totalOffers: 1}})])
    .then(result=>{
        req.flash('success', 'You successfully created an offer.');
        req.session.save(()=>{
            return res.redirect('back');
        })
 
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
        {
            err.status = 400;
        }
        next(err);
    });
}

exports.accept = (req, res, next) =>{
    let gameId = req.params.id;
    let offerId = req.params.offerId;
    Promise.all([Game.findByIdAndUpdate(gameId, {active: false}), offer.updateMany({game: gameId}, {status: 'rejected'})])
    .then(result=>{
        Promise.all([offer.findByIdAndUpdate(offerId,{status: 'accepted'})])
        .then(result=>{
            return res.redirect('back');
        })
    })
}