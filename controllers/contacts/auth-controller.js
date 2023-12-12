import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";
import tryCatchWrapper from "../../decorators/tryCatchWrapper.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ ...req.body, password: hashPassword });

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (error) {
        throw HttpError(400, "Missed required field");
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
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
            },
        })
    } catch (error) {
        throw HttpError(401, "Email or password is wrong");
    }
}

const getCurrent = async (req, res) => {
    try {
        const { username, email } = req.user;

        res.json({
            user: {
                username,
                email,
            }
        });
    } catch (error) {
        throw HttpError(401, "Not authorized");
    }
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
}

export default {
    signup: tryCatchWrapper(signup),
    signin: tryCatchWrapper(signin),
    getCurrent: tryCatchWrapper(getCurrent),
    signout: tryCatchWrapper(signout),
}