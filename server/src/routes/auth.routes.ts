import express from "express";
import validate from "../middlewares/validate.middleware";
import { forgotPasswordSchema, resetPasswordSchema, resendOtpSchema, loginSchema, registerSchema, verifyOtpSchema } from "../validations/auth.validation";
import { registerController, loginController, logoutController, verifyEmailController, resendOtpController, forgotPasswordController, resetPasswordController, refreshTokenController } from "../controllers/auth.controller";
import { authLimiter, otpLimiter, passwordResetLimiter } from "../middlewares/rateLimit.middleware";
const router = express.Router();

router.post(
    "/register",
    authLimiter,
    validate(registerSchema),
    registerController
)

router.post(
    "/verify-email",
    otpLimiter,
    validate(verifyOtpSchema),
    verifyEmailController
)

router.post(
    "/login",
    authLimiter,
    validate(loginSchema),
    loginController
)

router.post(
    "/forgot-password",
    passwordResetLimiter,
    validate(forgotPasswordSchema),
    forgotPasswordController
)

router.post(
    "/reset-password",
    passwordResetLimiter,
    validate(resetPasswordSchema),
    resetPasswordController
)

router.post(
    "/resend-otp",
    otpLimiter,
    validate(resendOtpSchema),
    resendOtpController
)
router.post(
    "/refresh-token",
    refreshTokenController
)

router.post(
    "/logout",
    logoutController
)

export default router;