import mongoose from "mongoose";

interface IOtpVerification{
    email: string,
    otp: string,
    type: "VERIFY_EMAIL" | "RESET_PASSWORD",
    tempUserData?: {
        name: string,
        email: string,
        hashedPassword:string
    },
    resendCount: number,
    lastSeenAt:Date
    expiresAt:Date
}
const otpVerificationSchema = new mongoose.Schema<IOtpVerification>({
    email:{
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        
        validate: {
            validator: function (value: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message:"Invalid email format"
        } 
    },

    otp: {
        type: String,
        required: [true, "OTP is required"],
        minlength: [6, "OTP must be 6 digit"],
        maxlength: [6, "OTP must be 6 digit"],
        
        validate: {
            validator: function (value: string) {
                return /^\d{6}$/.test(value);
            },
            message:"OTP must contain exactly 6 digits"
        }
    },

    type: {
        type: String,
        required: true,
        enum: {
            values: ["VERIFY_EMAIL"],
            message:"Invalid OTP type"
        }
    },

    tempUserData: {
        type: {
            name: {
            type:String,
            trim:true
        },
        email: {
            type:String
        },
        hashedPassword: {
            type:String
        }
        },
        default: null,
    },
    resendCount: {
        type: Number,
        default:0
    },
    lastSeenAt: {
        type: Date,
        default:Date.now
    },
    expiresAt: {
        type: Date,
        required:true
    }
}, { timestamps: true })

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpVerificationSchema.index({ email: 1 ,type:1});

const OtpVerification = mongoose.model<IOtpVerification>("OtpVerification", otpVerificationSchema);
export default OtpVerification