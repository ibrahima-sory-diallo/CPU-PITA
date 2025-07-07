const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator'); // Utilisation uniquement d'isEmail

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 55
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,  
        lowercase: true, // Utilisation de lowercase directement dans le schéma
        validate: [isEmail, 'Email non valide']
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 55
    },
    picture: {
        type: String,  
        default: './uploads/profil/randun-user.png'
    },
    bio: {
        type: String,
        maxlength: 1025
    },
    role: {
        type: String,  
        enum: ['admin', 'utilisateur'], // 🔥 Rôles autorisés
        default: 'utilisateur' // 🔥 Par défaut, c'est un utilisateur
    }
},
{
    timestamps: true
});
userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
} )

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('User', userSchema);

module.exports = User;
