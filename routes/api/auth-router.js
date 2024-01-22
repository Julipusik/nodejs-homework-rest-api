import express from "express";
import authController from "../../controllers/contacts/auth-controller.js";
import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";
import validateWrapper from "../../decorators/validateWrapper.js";
import { userSignupSchema, userSigninSchema, updateSubscriptionSchema, userEmailSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateWrapper(userSignupSchema), authController.signup);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody, validateWrapper(userEmailSchema), authController.resendVerify);

authRouter.post("/login", isEmptyBody, validateWrapper(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/", authenticate, validateWrapper(updateSubscriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;