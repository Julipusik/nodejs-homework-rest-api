import express from "express";
import authController from "../../controllers/contacts/auth-controller.js";
import { authenticate, isEmptyBody} from "../../middlewares/index.js";
import validateWrapper from "../../decorators/validateWrapper.js";
import { userSignupSchema, userSigninSchema, updateSubscriptionSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateWrapper(userSignupSchema), authController.signup);

authRouter.post("/login", isEmptyBody, validateWrapper(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/", authenticate, validateWrapper(updateSubscriptionSchema), authController.updateSubscription);

export default authRouter;