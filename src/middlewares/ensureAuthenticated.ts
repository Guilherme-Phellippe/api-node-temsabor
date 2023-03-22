import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


export function ensureAuthenticated(req: Request , res: Response, next: NextFunction){
    const authToken = req.headers.authorization

    if(authToken){
        const [, token] = authToken.split(" ");

        try {
            verify(token , "gui34/35julia38/39" )

            return next();

        } catch (error) {
            res.status(401).json({ Error : "Token invalid"})
        }

    }else res.status(400).json({ Error : "Token is missing"})
}