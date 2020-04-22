var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://enairo:enairo@cluster0-pte8o.mongodb.net/Martina',
    options,
    function (error) {
        if (error) {
            console.log('je suis le probleme !!!', error);
        } else {
            console.log("**** PERFECT CONNECT ****");
        }
    });


module.exports = mongoose;