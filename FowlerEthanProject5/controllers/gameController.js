const multer = require('multer');
const model = require('../models/game');
const offer = require('../models/offer');


//Callback function to all of the items in the store
exports.index = (req, res, next) =>{

    if(req.query.search == undefined)
    {
        model.find()
        .then(items=>{
            res.render('./game/items', {items});
        })
        .catch(err=>next(err));
        
    }
    else
    {
        
        model.find()
        .then(temp=>{
            let items = [];
            temp.forEach(item=>{
            let titleLower = item.title.toLocaleLowerCase();
            let detailsLower = item.details.toLocaleLowerCase();
            if(titleLower.includes(req.query.search.toLowerCase()) || detailsLower.includes(req.query.search.toLowerCase()))
            {
                items.push(item);
            }
        });
        
            res.render('./game/items', {items});
        })
        .catch(err=>next(err));
        
        
    }
};


//Callback function to show the form for creating a new item
exports.new = (req, res) =>{
    res.render('./game/new');
};
//Callback function for creating a new item 
exports.create = (req, res, next) =>{
    let item = new model(req.body);//create a new game document
    if(req.file != null)
    {
        item.image = '/images/' + req.file.filename;
    }
    
    item.seller = req.session.user;
    item.active = true;

    item.save()//insert document to database
    .then((item=>{
        req.flash('success', 'You successfully created the item!');
        req.session.save(()=>{
            res.redirect('/games');
        });
    }))
    .catch(err=>{
        if(err.name === 'ValidationError')
        {
            err.status = 400;
        }
        next(err);
    });
    
};


//Callback function to display a specific item by an id
exports.show = (req, res, next) =>{
    let id = req.params.id;
    let user = req.session.user;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item=>{
        if(item)
        {
            if(item.active === false)
            {
                if(user)
                {
                    console.log(item.seller._id);
                    console.log(user);
                    if(item.seller._id == user)
                    {
                        res.render("./game/item", {item, user});
                    }
                    else
                    {
                        let err = new Error('Access Denied: Cannot Access Product');
                        err.status = 401;
                        next(err);
                    }
                }
                else
                {
                    req.flash('error', 'You are not logged in');
                    req.session.save(()=>{
                        return res.redirect('/users/login');
                    })
                }
            }
            else
            {
                res.render("./game/item", {item, user});
            }
            
        }
        else
        {
            let err = new Error("Cannot find a item with id " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};


//Callback function to get the edit form for a specific item
exports.edit = (req, res, next) =>{
    let id = req.params.id;
    
    model.findById(id)
    .then(item=>{
        if(item)
        {
            res.render('./game/edit', {item});
        }
        else
        {
            let err = new Error("Cannot find a item with id " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};
//Callback function to update the information for that item by an id
exports.update = (req, res, next) =>{
    let item = req.body;
    let id = req.params.id;


    if(req.file != null)
    {
        item.image = '/images/' + req.file.filename;
    }
    
    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item)
        {
            req.flash('success', 'You successfully edited the item!');
            req.session.save(()=>{
                res.redirect('/games/' + id);
            });
        }
        else
        {
            let err = new Error("Cannot find a item with id " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name == 'ValidationError')
        {
            err.status = 400;
        }
        next(err);
    });
};



//Callback function to delete a specific story by its id
exports.delete = (req, res, next) =>{
    let id = req.params.id;
    
    Promise.all([model.findByIdAndDelete(id, {userFindAndModify: false}), offer.deleteMany({game : id})])
    .then(result=>{
        if(result)
        {
            req.flash('success', 'You have successfully deleted the item!');
            req.session.save(()=>{
                res.redirect('/games');
            })    
        }
        else
        {
            let err = new Error("Cannot find a item with id " + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>{next(err)});
};