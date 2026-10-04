const monggose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new monggose.Schema({
    name: {
        type: String,
        required:   [true, 'Name is required'],
       
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim:true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Exclude password from query results by default
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false,
    }
    
},
{
    timestamps: true
}
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    return 
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const userModal = monggose.model('User', userSchema);
module.exports = userModal; 
