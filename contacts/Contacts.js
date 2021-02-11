const mongoose = require('mongoose');

const {Schema} = mongoose;


//*Example

// id:5eb074232c30a1378dacdbda
// name :"Allen Raymond"
// email:"nulla.ante@vestibul.co.uk"
// phone:"(992) 914-3792"
// subscription:"free"
// password: "password"
// token:""

const ContactSchema = new Schema({
name: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => value.includes('@'),
},
phone:{
    type: String,
    required: true,
},
password:{
    type: String,
    required: true,
},
subscription:{
    type: String,
    required: true,
},
token:{
    type: String,
}

})

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;