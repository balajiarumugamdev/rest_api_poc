import { getUserBySessionToken } from 'db/users';
import express from 'express';
import {get, merge } from 'lodash'

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> => {
    try {
        const sessionToken = req.cookies['BALAJI_AUTH'];

        if (!sessionToken) {
            return res.sendStatus(401);
        }
        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(401);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}