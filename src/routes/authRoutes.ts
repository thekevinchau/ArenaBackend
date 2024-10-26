import { Router, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import User from "../entities/User";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const authRouter: Router = Router();
const JWT_SECRET: string = String(process.env.JWT_SECRET);

authRouter.get('/', (req: Request, res: Response) => {
    res.send('You have entered the auth route!')
})


/*

When a user makes a post request to the auth route, it will first check
    - If they are a user in the system (by checking if the user at least exists)
    - If they are a user, then it checks their password by comparing the hashes of both the password and user password.
    - If both are true, then we are able to send a token back that has a payload of the user's ID (that way we can query the database with this) and role.
        - We REALLY want to avoid sending in the full information of the user.

*/
authRouter.post('/', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});

        if (!user){
            return res.status(403).json({message: 'User does not exist!'});
        }

        const isSamePassword: boolean = (password === user.password);
        if (!isSamePassword){
            return res.status(403).json({message: "Incorrect password!"});
        }

        const token = jwt.sign({userID: user._id, userRole: user.role}, JWT_SECRET, {expiresIn: '1800s'});
        return res.status(200).json({token: token});


    }catch(err){
        return res.status(500).json({message: "Server error when trying to authenticate user!"})
    }
})

export default authRouter;