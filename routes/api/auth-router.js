import express from "express";
import authController from "../../controllers/contacts/auth-controller.js";
import { authenticate, isEmptyBody} from "../../middlewares/index.js";
import validateWrapper from "../../decorators/validateWrapper.js";
import { userSignupSchema, userSigninSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateWrapper(userSignupSchema), authController.signup);

authRouter.post("/signin", isEmptyBody, validateWrapper(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

export default authRouter;