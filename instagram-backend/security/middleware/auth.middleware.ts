import { NextFunction,Request,Response,Router } from "express";
import AuthError from "../error/AuthError";
import { JwtPayloadId } from "../types/secutity";
import { verify } from "../service/jwt.service"

const jwtAuthenticationMiddleware = (req:Request,resp:Response,next:NextFunction)=>{
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throw new AuthError('auth not found')
    }

    if (!authorizationHeader.includes('Bearer ')) { // lo spazio dopo Bearer e' OBBLIGATORIO
        throw new AuthError('auth not found')
    }
    
    // utilizzando replace tolgo la stringa bearer di modo da rimanere solo col token
    const token = authorizationHeader.replace('Bearer ' , "") // lo spazio dopo Bearer e' OBBLIGATORIO



    try {
        const payload:JwtPayloadId = verify(token)
        req.principal = {
            id:payload.id,
            email:payload.email,
            password:payload.password,
            username:payload.username,
            roles:payload.roles
        };
        console.log(req.principal,"principal 😱");
        
        console.log(payload)
        next();
    } catch (error:any) {
        throw new AuthError(error.message)
    }

}

export {jwtAuthenticationMiddleware};