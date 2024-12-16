const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'Enter your First Name']},
    lastName: {type: String, required: [true, 'Enter your Last Name']},
    email: {type: String, required: [true, 'Enter your email'], unique: true},
    password: {type: String, required: [true, 'Enter your password']}
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
    {
        return next();
    }
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

userSchema.methods.authenticatePassword = function(passwordToCheck)
{
    let user = this;
    return bcrypt.compare(passwordToCheck, this.password);
}

module.exports = mongoose.model('User', userSchema);