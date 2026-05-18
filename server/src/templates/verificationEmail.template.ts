export const verificationEmailTemplate = (
    otp:string
) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
      
      <h2>Verify your email</h2>

      <p>
        Welcome to Speakwell.
      </p>

      <p>
        Your verification code is:
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
        If you did not request this, please ignore this email.
      </p>

    </div>
    `
}