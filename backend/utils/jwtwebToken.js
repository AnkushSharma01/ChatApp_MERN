import jwt from "jsonwebtoken"; 

const jwtToken = (userId, res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '90d'
    })
    res.cookie('jwt',token,{
        maxAge: 30 *24 *60 *60 *1000,
        httpOnly:true,
        samesite:"strict",
        secure:process.env.SECURE !== "development"
    })
}
export default jwtToken