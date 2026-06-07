const mongoose =  require('mongoose');
const bcrypt =  require('bcrypt');
const UserScheme = mongoose.Schema(
{
  username:{
    type:String,
    required:true,
  } ,
  password:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true,
    match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Invalid email'],
  },
  mobile:{
    type:Number,
    required:true,
    unique:true,
    match:[/^[6-9]\d{9}$/]
  },
  mobileVerfied:{
    type:Boolean,
    default:false
  },
  emailVerfied:{
    type:Boolean,
    default:false
  },
   referalcode:{
    type:String,
    required:true,
  } 
},{ timestamps:true}
);
UserScheme.pre('save', async function(){
  try{ 
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.password,salt);
    this.password = password;

  }catch(err){
    throw err;
  }
});

UserScheme.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password,this.password);
  
}

module.exports = mongoose.model('User',UserScheme);