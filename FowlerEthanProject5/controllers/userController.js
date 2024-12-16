const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const model = require('../models/user');
const Game = require('../models/game');
const Offer = require('../models/offer');

//get the sign up form
exports.new = (req, res)=>{
    if(req.session.user)
    {
        req.flash('error', 'You are already logged in!');
        req.session.save(()=>{
            res.redirect('/users/profile');
        })
    }
    else
    {
        res.render('./user/new');
    }
}
//create a new user
exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(()=>{
        req.flash('success', 'You Successfully Created an Account!');
        req.session.save(()=>{
            res.redirect('/users/login');
        });
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
        {
            req.flash('error', 'Validation Error, Please try again.');
            req.session.save(()=>{
                return res.redirect('/users/new');
            });
            
        }
        else if(err.code === 11000)
        {
            
            req.flash('error', 'Account with this email already exists.');
            return res.redirect('/users/new');
        }
        else
        {
            next(err);
        }
        
    })
}


//get the login page
exports.login = (req, res)=>{
    if(req.session.user)
    {
        req.flash('error', 'You are already logged in!');
        req.session.save(()=>{
            res.redirect('/users/profile');
        })
    }
    else
    {
        res.render('./user/login');
    }
}
//process login request
exports.process = (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({email: email})
    .then(user=>{
        if(user)
        {
            user.authenticatePassword(password)
            .then(result=>{
                if(result)
                {
                    req.session.user = user._id;
                    req.flash('success', 'Logged in Successfully!');
                    req.session.save(()=>{
                        res.redirect('/users/profile');
                    });
                    
                }
                else
                {
                    req.flash('error', 'Incorrect Password, Please try again.');
                    req.session.save(()=>{
                        res.redirect('/users/login');
                    });
                }
            })
            
        }
        else
        {
            req.flash('error', 'Incorrect Email, Please try again.');
            req.session.save(()=>{
                res.redirect('/users/login');
            });
            
        }
    })
    .catch(err=>next(err));
}


//get profile
exports.index = (req, res, next)=>{
    let id = req.session.user;
    if(id)
    {
        Promise.all([model.findById(id), Game.find({seller: id}), Offer.find({buyer: id}).populate('game', 'title _id')])
        .then(result=>{  
            const [user, items, offers] = result;
            res.render('./user/profile', {user, items, offers});
        })
        .catch(err=>next(err));
    }
    else
    {
        req.flash('error', 'Please Login First!');
        req.session.save(()=>{
            res.redirect('/users/login');
        })
    }
}


//logout user
exports.logout = (req, res, next)=>{
    if(req.session.user)
    {
        req.session.destroy(err=>{
            if(err)
            {
                return next(err);
            }
            else
            {
                res.redirect('/');
            }
        });
    }
    else
    {
        req.flash('error', 'Please Login First!');
        req.session.save(()=>{
            res.redirect('/users/login');
        })
    }
}