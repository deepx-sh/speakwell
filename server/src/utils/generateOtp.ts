import crypto from "crypto"

export const generateOtp = (): string => {
    return crypto.randomInt(100000,999999).toString()
}

export const generateOtpExpire = (minutes: number = 10): Date => {
    return new Date(Date.now()+minutes*60*1000)
}