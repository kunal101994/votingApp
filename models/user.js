const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// define person schema
const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    mobile:{
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["voter", "admin"],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
}, 
{timestamps: true})

// pre middleware
userSchema.pre('save', async function(next){
    const person = this;
    // hash the password only if it is has been modified (or is new)
    if(!person.isModified('password')) return next();
    try {
        // has password generate
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashPassword = await bcrypt.hash(person.password, salt);

        // override the plain password with the hashed one
        person.password = hashPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

// create a function compare password
userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;