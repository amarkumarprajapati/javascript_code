const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/codesis')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection error:', err));


const airbnbSchema = new mongoose.Schema({});


const Airbnb = mongoose.model('assets', airbnbSchema);


// Airbnb.aggregate([
//     {
//         $lookup: {
//             from: "assets",
//             foreignField: "addedByEmail",
//             localField: "email",
//             as: "assests"
//         }
//     },
//     {
//         $lookup:{

//         }
//     }
// ])
     Airbnb.find()
    .limit(3)
    .then((doc) => {
        console.log('Found document:', doc);
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Query error:', err);
        mongoose.connection.close();
    });
