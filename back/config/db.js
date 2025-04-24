const mongoose = require('mongoose')
const connectDB = async() =>{
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MONGO_URL:", process.env.MONGO_URL);
        console.log('MongoDB connecteé')
    } catch (error) {
        console.log('Erreur de connexion à mongoDB:', error)
        process.exit(1)
        
    }
}
module.exports = connectDB