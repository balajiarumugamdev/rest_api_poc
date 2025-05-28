import { createUser, getUsersByEmail } from "../db/users";
import { Request, Response } from "express";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUsersByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(401);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash.toString()) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    ).toString();

    await user.save();

    res.cookie("BALAJI_AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const register = async (req: Request, res: Response): Promise<void> => {
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
