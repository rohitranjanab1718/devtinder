const mongoose = require('mongoose');

const connectDb = async() =>{
    await mongoose.connect('mongodb+srv://rohitranjanab1718:XEbg395OYLbKJfKI@cluster0.deooe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

module.exports = connectDb;