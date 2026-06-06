import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRES_IN",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_EXPIRES_IN",
  "JWT_RESET_PASSWORD_TOKEN_SECRET",
  "JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN",
  "BREVO_SMTP_HOST",
  "BREVO_SMTP_PORT",
  "BREVO_API_KEY",
  "BREVO_SMTP_PASS",
  "BREVO_FROM_EMAIL",
  "CLIENT_URL",
  // "OPENAI_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
"CLOUDINARY_API_KEY",
"CLOUDINARY_API_SECRET"
];


requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`)
    }
})

export const env={
    PORT: process.env.PORT as string,
     NODE_ENV:process.env.NODE_ENV as string,
  MONGO_URI:process.env.MONGO_URI as string,
  JWT_ACCESS_TOKEN_SECRET:process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_ACCESS_TOKEN_EXPIRES_IN:process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  JWT_REFRESH_TOKEN_SECRET:process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_EXPIRES_IN:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  JWT_RESET_PASSWORD_TOKEN_SECRET:process.env.JWT_RESET_PASSWORD_TOKEN_SECRET as string,
  JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN:process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN as string,
    BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST as string,
  BREVO_SMTP_PORT:process.env.BREVO_SMTP_PORT as string,
  BREVO_API_KEY:process.env.BREVO_API_KEY as string,
  BREVO_SMTP_PASS:process.env.BREVO_SMTP_PASS as string,
  BREVO_FROM_EMAIL:process.env.BREVO_FROM_EMAIL as string,
  CLIENT_URL:process.env.CLIENT_URL as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  SERVER_URL:process.env.SERVER_URL as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY as string,
CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET as string,
}