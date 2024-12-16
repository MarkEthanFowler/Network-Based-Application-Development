const express = require('express');
const controller = require('../controllers/gameController');
const offerRoutes = require('./offerRoutes');
const { upload } = require('../middleware/fileUpload');
const { isLoggedIn, isSeller, isGuest} = require('../middleware/authentication');
const { validateId, validateCreate, validateEdit, validateRequest } = require('../middleware/validator');
const router = express.Router();


//Send all items to the user
router.get('/', controller.index);

//send form to create new item
router.get('/new', isLoggedIn, controller.new);

//create a new item
router.post('/', isLoggedIn, upload, validateCreate, validateRequest, controller.create);

//send details of item identified by an id
router.get('/:id', validateId, controller.show);

//send form for editing an existing item
router.get('/:id/edit', validateId, isLoggedIn, isSeller, controller.edit);

//update a item by an id
router.put('/:id', validateId, isLoggedIn, isSeller, upload, validateEdit, validateRequest, controller.update);

//delete a item by an id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);

router.use('/:id/offers', offerRoutes);

module.exports = router;