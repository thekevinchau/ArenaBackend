import {Request, Response, NextFunction} from "express";
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { ObjectId } from "mongoose";
dotenv.config();

const JWT_SECRET: string = String(process.env.JWT_SECRET);
interface JwtPayload {
    userID: ObjectId,
    isAdmin: boolean,
    teamName: string
}

/*
We're going to grab the JWT that was passed into the request headers from the client side. We're going to verify that token against the token we have
stored on the server for that particular user. If they match, then they are authorized to continue making other requests around our server. Then after that,
we can pass it onto the next middleware function.
*/

export const verifyJWT = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers['authorization'];

    const token = authHeader?.split(' ')[1];

    if (!token){
        return res.status(403).json({message: "Token not provided!"});
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { userID: decoded.userID, isAdmin: decoded.isAdmin, teamName: decoded.teamName }
    next();
}