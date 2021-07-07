const mongoose = require('mongoose');

const {Schema} = mongoose;

//*Example
// {
//     email: String,
//     password: String,
//     subscription: {
//       type: String,
//       enum: ["free", "pro", "premium"],
//       default: "free"
//     },
//     token: String
//   }

  
const UserSchema = new Schema({
 
    email: {
        type: String,
        required: true,
    },
   
    password: String,
    avatarURL: String,
    

    subscription:{
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    },
    token: String,
    
    
    })
    
    const User = mongoose.model('User', UserSchema);
    
    module.exports = User;