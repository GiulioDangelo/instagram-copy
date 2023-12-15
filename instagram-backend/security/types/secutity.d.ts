import { Express } from "express-serve-static-core"
import { JwtPayload } from "jsonwebtoken"


export interface JwtPayloadId extends JwtPayload{
    id:number,
    email:string|null,
    password:string|null,
    username:string|null,
    roles?:string[]
}

export interface Principal {
    id:number,
    email:string|null,
    password:string|null,
    username:string|null,
    roles?: string[]
}

declare module 'express-serve-static-core' {
    interface Request {
        principal:Principal
    }
}