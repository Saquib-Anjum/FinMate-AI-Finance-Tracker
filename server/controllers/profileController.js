import profileModel from "../models/ProfileModel.js";


//getProfile
const getProfile = async (req , res)=>{
  try{
   const {userId } = req.user;
  
   if(!id){
    return res.status(400).json({
      success:false,
      message:"Failed to find user"
    })
   }
   const profile = await profileModel.find({userId:userId});
   if(!profile){
    return res.status(404).json({
      success:false,
      message:"Profile not found"
    })
   }
   res.json({
    success:true,
    data:profile
   })
  }catch(err){

  }
}

const updateProfile = async (req , res)=>{
  try{
   const {userId} = req.user;
   const {avatar,bio,phone,country,
    currency,
   } = req.body;

   const profile = await profileModel.find({userId:userId});
   if(!profile){
    return res.status(404).json({
      success:false,
      message:"Profile not found"
    })
   }

   if(avatar !==undefined){
    profile.avatar= avatar;

   }
   if(bio !==undefined){
    profile.bio =bio;
   }
   if(phone !==undefined){
    profile.phone=phone;
   }
   if(country !=undefined){
    profile.country= country;
   }
   if(currency !==undefined){
    profile.currency=currency;
   }

   await profile.save();
   return res.json({
    success:true,
    message:"Profile updated successfully"
   })
  }catch(err){
    
  }
}

const deleteProfile = async (req , res)=>{
  try{

  }catch(err){
    
  }
}

export {getProfile,updateProfile,deleteProfile};