import { createUser, getUsersByEmail } from "../db/users";
import { Request, Response } from "express";
import { authentication, random } from "../helpers";

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.sendStatus(400);
      return;
    }

    const existingUser = await getUsersByEmail(email);

    if (existingUser) {
      res.sendStatus(400);
      return;
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
