export const resetPasswordEmailTemplate = (
    otp:string
) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
      
      <h2>Reset your password</h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Your password reset code is:
      </p>

      <div
        style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          margin: 20px 0;
        "
      >
        ${otp}
      </div>

      <p>
        This code will expire in 10 minutes.
      </p>

      <p>
        If you did not request this, please secure your account.
      </p>

    </div>
    `
}