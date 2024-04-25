const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({

    name:{
        type:String,
        required: [true,"please add a name"],
    },

    email:{
        type:String,
        required:[true,"please enter an email"],
        unique:[true,"email already exists"],
    },

    password:{
        type:String,
        required:[true,"please enter an password"],
        minlength:[6,"password must be atleast 6 character"],
        select:false,
    },

    avatar:{
        public_id:String,
        url:String,
    },

    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", 
        },
    ],

    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        },
    ],

    followings:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        },
    ],
});

module.exports=mongoose.model("User",userSchema);