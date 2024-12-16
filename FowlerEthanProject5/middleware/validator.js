const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-f]{24}$/))
    {
        let err = new Error('Invalid game id');
        err.status = 400;
        return next(err);
    }
    else
    {
        return next();
    }
}

exports.validateRequest = (req, res, next) =>{
    let errors = validationResult(req);

    if(!errors.isEmpty())
    {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    else
    {
        return next();
    }
}

exports.validateSignup = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').notEmpty().isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 character and at most 64 characters').notEmpty().trim().isLength({min: 8, max: 64})];

exports.validateLogin = [body('email', 'Email must be a valid email address').notEmpty().isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 character and at most 64 characters').notEmpty().trim().isLength({min: 8, max: 64})];

exports.validateEdit = [body('condition', 'Condition must be one of the valid options').isIn(['Near Mint', 'Lightly Used', 'Moderately Used', 'Heavily Used', 'Damaged']).notEmpty().trim().escape(),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Price must be a valid amount').isCurrency().notEmpty().trim().escape(),
    body('details', 'Details must not be empty').notEmpty().trim().escape()];

exports.validateCreate = [body('condition', 'Condition must be one of the valid options').isIn(['Near Mint', 'Lightly Used', 'Moderately Used', 'Heavily Used', 'Damaged']).notEmpty().trim().escape(),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Price must be a valid amount').isCurrency().notEmpty().trim().escape(),
    body('details', 'Details must not be empty').notEmpty().trim().escape()];

exports.validateOffer = [body('amount', 'Amount must be a valid amount').isCurrency().notEmpty().trim().escape()];

/*body('image', 'Image cannot be empty').notEmpty().trim(),
    body('totalOffers', 'Total Offers cannot be empty').notEmpty().trim().escape(),
    body('maxOffer', 'Max Offer cannot be empty').notEmpty().trim().escape()*/ 