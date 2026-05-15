import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    name: string,
    email: string,
    password: string,
    avatar?: string,
    isVerified: boolean,
    role: "owner",
    lastLogin?: Date | null,
}
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength:[50,"Name cannot exceed 50 characters"]
    },

    email: {
        type: String,
        required:[true,"Email is required"],
        unique: true,
        lowercase:true,
        trim: true,

        validate: {
            validator: function (value: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message:"Invalid email format"
        }
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select:false,
        validate: {
            validator: function (value: string) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message:"Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
        },
    },

    avatar: {
        type: String,
        default: "https://images.unsplash.com/vector-1769600877914-695985faffd0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        trim:true
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    role: {
        type: String,
        enum: {
            values: ["owner"],
            message:"Invalid role"
        },
        default:"owner"
    },

    lastLogin: {
        type: Date,
        default:null
    },
    
},{
        timestamps:true
})
    

const User = mongoose.model<IUser>("User", userSchema);
export default User;