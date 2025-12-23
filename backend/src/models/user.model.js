import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const userSchema = new Schema({
    fullName:{
        type: String,
        default: null,
        // required: true,
        // unique: false,
        // lowercase: true,
        // trim : false,
        // index : true
    },
         username: {
            type: String,
            required: false,
            unique: true,
            //sparse: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            index: true,
            match: /^[a-zA-Z0-9._]+$/,
        },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
    },

    contactNumber:{
        type: String,
        required: false,
        unique: false,
        default: null,
    },
    bio:{
        type: String,
        required: false,
        unique: false,
        default: null,
    },
    profilePic:{
        type: String,
        required: false,
        default: null,
    },        
    
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type: String,
    }
},
{
    timestamps: true
}
)
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)    
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            // fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// const User = mongoose.model("User", userSchema);
// // Ensure a sparse unique index on `username` so multiple null/undefined values are allowed
// userSchema.index({ username: 1 }, { unique: true, sparse: true });

// // After model is compiled, attempt to drop any old non-sparse username index and create the new one
// mongoose.connection.once('open', async () => {
//     try {
//         // Drop existing index if it exists (the old index name is typically 'username_1')
//         await User.collection.dropIndex('username_1');
//     } catch (err) {
//         // Ignore index-not-found errors
//         if (err && err.codeName !== 'IndexNotFound' && !(err.message && err.message.toLowerCase().includes('index not found'))) {
//             console.error('Error dropping old username index:', err);
//         }
//     }

//     try {
//         await User.collection.createIndex({ username: 1 }, { unique: true, sparse: true });
//     } catch (err) {
//         console.error('Error creating sparse unique username index:', err);
//     }
// });

const User = mongoose.model("User", userSchema);

export default User;

