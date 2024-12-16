const Game = require('../models/game');

//check if the user is a guest
exports.isGuest = (req, res, next)=>{
    
    if(!req.session.user)
    {
        return next();
    }
    else
    {
        req.flash('error', 'You are logged in already!');
        req.session.save(()=>{
            return res.redirect('/users/profile');
        });
    }
};

//check if user is authenticated 
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user)
    {
        return next();
    }
    else
    {
        
        req.flash('error', 'You are not logged in!');
        req.session.save(()=>{
            return res.redirect('/users/login');
        });
    }
}

//check if the user is the seller of the game
exports.isSeller = (req, res, next)=>{
    let id = req.params.id;

    

    Game.findById(id)
    .then(item=>{
        if(item)
        {
            
            if(item.seller == req.session.user)
            {
                return next();
            }
            else
            {
                let err = new Error('Access Denied: Product does not belong to you.');
                err.status = 401;
                next(err);
            }
        }
        else
        {
            let err = new Error('Cannot find a game with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.isOwner = (req, res, next)=>{
    let id = req.params.id;

    Game.findById(id)
    .then(item=>{
        if(item)
        {
            if(item.seller == req.session.user)
            {
                let err = new Error('Access Denied: This Product belongs to you.');
                err.status = 401;
                next(err);
            }
            else 
            {
                return next();
            }
        }
        else
        {
            let error = new Error('Cannot find a game with id ' + id);
            err.status = 404;
            next(err);
        }
    })
}