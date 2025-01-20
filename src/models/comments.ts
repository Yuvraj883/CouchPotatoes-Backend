import {Schema, model, Document, Model} from 'mongoose';
export interface IComment extends Document{
    name:string;
    email:string;
    text:string;
    date:Date;
    movie_id:Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
    name:{type:String, required:true},
    email:{type:String, required:true},
    text:{type:String, required:true},
    date:{type:Date, default:Date.now},
    movie_id:{type:Schema.Types.ObjectId, ref:'Movie'}
},{timestamps:true});

const Comment = model<IComment>('Comment', commentSchema);
export default Comment;

