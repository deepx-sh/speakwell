import crypto from "crypto";

export const generateToken = (): string => {
    return crypto.randomBytes(16).toString("hex");
}
