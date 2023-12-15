import jwt from "jsonwebtoken";
import { JwtPayloadId } from "../types/secutity";

const secretKey = process.env.SECRET_KEY as string;

function sign(payload:JwtPayloadId):string {
    return jwt.sign(payload,secretKey);
}

function verify(token:string): JwtPayloadId{
    const payload = jwt.verify(token,secretKey) as JwtPayloadId;
    return payload;
}

export {sign , verify};