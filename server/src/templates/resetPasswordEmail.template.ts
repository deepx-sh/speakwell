export const resetPasswordEmailTemplate = (
    resetUrl:string
) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h2 style="margin: 0 0 12px; font-size: 22px; color: #1C1C1A;">Reset your password</h2>
      <p style="margin: 0 0 24px; font-size: 15px; color: #6B6860; line-height: 1.6;">
        Someone requested a password reset for your Speakwell account.
        If this was you, click the button below. This link expires in 10 minutes.
      </p>
      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 12px 28px;
          background: #C96B3F;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
        "
      >
        Reset Password
      </a>
      <p style="margin-top: 28px; font-size: 13px; color: #6B6860;">
        If you did not request this, you can safely ignore this email.
        Your password will not be changed.
      </p>
    </div>
    `
}