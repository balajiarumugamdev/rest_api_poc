import { getUserBySessionToken } from "../db/users";
import express from "express";
import { get, merge } from "lodash";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const sessionToken = req.cookies["BALAJI_AUTH"];

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
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): any => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity_id") as string;

    if (!currentUserId) {
      return res.sendStatus(401);
    }
    if (currentUserId.toString() !== id) {
      return res.sendStatus(401);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
