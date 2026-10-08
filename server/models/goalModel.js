import mongoose from 'mongoose';
const goalSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
  },
  title:{
    type:String,
  
  },
  targetAmount:{
    type:Number,
    default:0,
  },
  savedAmount:{
    type:Number,
    default:0
  }

},{timestamps:true,});
const goalModel = mongoose.models.Goal||mongoose.model("Goal",goalSchema);

export default goalModel;