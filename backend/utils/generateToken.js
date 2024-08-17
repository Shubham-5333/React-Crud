import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (res,userId ) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })

    res.cookie('jwt',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge:30*24*60*60*1000,
    }) 
}

const generateAdminToken = (res, role) => {
    const token = jwt.sign({ role }, process.env.JWT_SECRET, {
        expiresIn: '30d' 
    });

    res.cookie('jwtadmin', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', 
        sameSite: 'strict', 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Example expiration
    });
};



export { generateAdminToken, generateToken };