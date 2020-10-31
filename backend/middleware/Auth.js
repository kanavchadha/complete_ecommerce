import jwt from 'jsonwebtoken';
import User from '../models/user';

const isAuth = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        const onlyToken = token.slice(7,token.length);
        jwt.verify(onlyToken,process.env.JWT_SECRET,async (err,decode)=>{
            if(err){
                console.log(err.message);
                return res.status(401).send({err: 'Invalid Token!'});
            }
            const user = await User.findById(decode._id);
            if(user){
                req.user = user;
                // console.log(user);
            }else{
                req.user = null;
            }
            
            return next();
        });
    }else{
        res.status(401).send({err: 'Not Authorized!'});
    }
}

const isAdmin = (req,res,next)=>{
    // console.log(req.user);
    if(req.user && req.user.isAdmin){
        return next();
    }
    return res.status(401).send({err: 'Admin Token is not valid!'});    
}

export {
    isAuth,
    isAdmin
}