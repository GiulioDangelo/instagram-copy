import { NextFunction,Request,Response } from "express";
import AuthError from "../error/AuthError";

const errorHandler = (err:Error, req:Request,resp:Response, next:NextFunction)=>{
    if(err instanceof AuthError){
        resp.status(401)
        resp.send({
            type:err.name,
            message:err.message,
        })
    }
}

export default errorHandler