import User from "../model/userModules.js";
import bcryptjs from 'bcryptjs';
import jwtToken from '../utils/jwtwebToken.js';




//  User Register Page

export const userRegister=async(req, res)=>{
    try{

        // user need to enter below entities
        const {fullname,username,email,gender,password,profilepic} = req.body; 

        // check username or email already exist or not
        const user = await User.findOne({username,email});
        if(user) return res.status(500).send({success:false,message:"UserName or Email Already Exist"});


        // for bcryption of password, here 10 means salt round
        const hashPassword = bcryptjs.hashSync(password,10);


        // for profile picture use avatar form given website, either user will provide or default pic will show
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username${username}`;



// Now save the details in database in following manner
        const newUser = new User({
            fullname,
            username,
            email,
            password:hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy: profileGirl
        })
        
        if(newUser){
            await newUser.save();
            jwtToken(newUser._id,res)
        }else{
            res.status(500).send({success: false, message: "Invalid User Data"})
        }


        // Now send it to the frontend
        res.status(201).send({
            _id: newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilepic:newUser.profilepic,
            email:newUser.email,
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);

    }
}
// ------------------------------------------------------


// User Login Page

export const userLogin = async (req,res)=>{
    try{

        // Check Already Register or not

        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(500).send({success:false,message:"Email Doesen't Exist"});
        const comparePass = bcryptjs.compareSync(password,user.password || "");
        if(!comparePass) return res.status(500).send({success:false, message: "Email or Password doesn't Matching"});


        // If exist
        jwtToken(user._id,res)
        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Succesfully Login"
        })
    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

// -------------------------------------------------------------------

// User LogOut Page

export const userLogOut = async (req,res)=>{
    try{

        // For LogOut just delete Token  by setting it maxAge =0
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({message:"User LogOut"})

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}


