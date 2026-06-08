const mongoose =  require('mongoose');
const bcrypt =  require('bcrypt');
const  ShopScheme = mongoose.Schema(
{
  shopname:{
    type:String,
    required:true,
  } ,
  username:{
    type:String,
    required:true,
  },
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
  location:{
    type:[Number],
    required:true
  },
   shopCode:{
    type:String,
    required:true,
  } 
},{ timestamps:true}
);
ShopScheme.pre('save', async function(){
  try{ 
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.password,salt);
    this.password = password;
    if(!this.isModified('shopCode')) return;
    const shopcode = await bcrypt.hash(this.shopCode,salt);
    this.shopCode = shopcode;

  }catch(err){
    throw err;
  }
});

ShopScheme.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password,this.password);
  
}

module.exports = mongoose.model('Shops',ShopScheme);