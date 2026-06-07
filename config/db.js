const mongoose =  require('mongoose');


const connectDB = async ()=>
{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mydb');
        console.log('db connected sucessfully');
    }catch(err)
    {
       
        console.log('db connected sucessfully',err);
        process.exit(1);
    }
}
module.exports = connectDB;

