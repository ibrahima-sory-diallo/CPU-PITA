const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
    mois:{
        type: String,
        required:true
    },
    recettes:{
        type: Number,
        required:true
    },
    depenses:{
        type: Number,
        required:true
    },
    solde: {
        type: Number
    },
});

module.exports = mongoose.model('Operation', OperationSchema);
