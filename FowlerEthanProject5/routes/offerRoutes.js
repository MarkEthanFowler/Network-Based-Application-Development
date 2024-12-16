const express = require('express');
const controller = require('../controllers/offerController');
const { isLoggedIn, isOwner, isSeller } = require('../middleware/authentication');
const { validateOffer, validateRequest } = require('../middleware/validator');
const router = express.Router({mergeParams: true});

//Send all the offers of a given game to the user
router.get('/', isLoggedIn, isSeller, controller.index);

//Create a new offer for a given game
router.post('/', isLoggedIn, isOwner, validateOffer, validateRequest, controller.create);

//accept a given offer associated with a game
router.get('/:offerId', isLoggedIn, isSeller, controller.accept);

module.exports = router;