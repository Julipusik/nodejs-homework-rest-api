import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";
import tryCatchWrapper from "../../decorators/tryCatchWrapper.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    });
}

const signin = async (req, res) => {
    try {
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password invalid");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password invalid");
        }

        const payload = {
            id: user._id,
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
        await User.findByIdAndUpdate(user._id, { token });

        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        })
    } catch (error) {
        throw HttpError(401, "Email or password is wrong");
    }
}

const getCurrent = async (req, res) => {
    try {
        const { email, subscription } = req.user;

        res.json({
                email,
                subscription,
        });
    } catch (error) {
        throw HttpError(401, "Not authorized");
    }
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
}

const updateSubscription = async (rec, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription });

    res.json({ message: "The subscription was updated successfully" });
}

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            throw HttpError(400, "No file provided");
        }
        const { _id } = req.user;
        const { path: oldPath, filename } = req.file;

        const img = await Jimp.read(oldPath);
        img.resize(250, 250);
        await fs.rename(oldPath);

        const newPath = path.join(avatarsPath, filename);
        await fs.rename(oldPath, newPath);

        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({ avatarURL });
    } catch (error) {
        throw HttpError(500, "Image update failed");
    }
};

export default {
    signup: tryCatchWrapper(signup),
    signin: tryCatchWrapper(signin),
    getCurrent: tryCatchWrapper(getCurrent),
    signout: tryCatchWrapper(signout),
    updateSubscription: tryCatchWrapper(updateSubscription),
    updateAvatar: tryCatchWrapper(updateAvatar),
}