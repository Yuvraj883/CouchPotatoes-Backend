import { Schema,model } from "mongoose";
import {randomBytes, createHmac, generateKey} from 'crypto'
import { generateToken } from "../services/auth.service";

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name:{
        type:String, 
        required:true
    }, 
    email:{
        type:String, 
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true,
        minLength:6
    },
    likedMovies:[
        {
            type: Schema.Types.ObjectId,
            ref:'Movie'
        }
    ],
    salt:{
        type:String, 
    },
    profilePic:{
        type:String, 
        default: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
    }

}, {timestamps:true})



userSchema.pre("save",  async function(next){
    if(!this.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(this.password).digest('hex');
    this.salt = salt; 
    this.password = hashedPassword;
    next();
})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User doesn't exist"); 

    const salt = user.salt; 
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex'); 
    if(user.password!==hashedPassword) throw new Error("Wrong password");
    
    const token = generateToken(user); 
    return token;
})

const Users = model("User", userSchema)
export default Users;