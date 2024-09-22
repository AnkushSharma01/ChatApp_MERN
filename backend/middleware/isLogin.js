// If two persons chat each othe then they should login first.
// So given below middleware check users are login or not.



import jwt from 'jsonwebtoken'
import User from '../model/userModules.js'

const isLogin = async(req,res,next)=>{
    try{
        // console.log(req.headers.cookies.jwt);
        const token = req.cookies.jwt
        // const token = req.headers.authorization?.split(' ')[1];

        // is token not present, it means user has not login bcoz when user has loggedin token automatically created
        if (!token) return res.status(500).send({success:false, message: "User Unauthorized"});

        // Now decode the token provided by user and match it with password
        const decode = jwt.verify(token,process.env.JWT_SECRET);

        // if not decode, it may matched with the register password or it may enter wrong
        if(!decode) return res.status(500).send({success:false, message: "User Unauthorized - Invalid Token"})

        // check by userid in databse    || select means not to show password
        const user = await User.findById(decode.userId).select("-password");
        if(!user) return res.status(500).send({success:false, message: "User not found"})


        // if found 
        req.user = user;
        next();
    }catch(error){
        console.log(`error in isLogin middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}
export default isLogin