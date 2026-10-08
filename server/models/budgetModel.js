import mongoose from 'mongoose';
import { CATEGORY } from '../constant/data.js';
const budgetSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true,

  },
  category:{
    type:String,
    category:CATEGORY,
      default:"Shoping"
  },
  limit:{
    type:Number,
    default:0,

  },
  spent:{
    type:Number,
    default:0,
  }
},{timestamps:true});

const budgetModel = mongoose.models.Budget || mongoose.model("Budget",budgetSchema);
export default budgetModel;