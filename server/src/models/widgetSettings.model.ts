import mongoose from "mongoose";

export interface IWidgetSettings{
    owner: mongoose.Types.ObjectId;
    primaryColor: string;
    theme: "light" | "dark";
    layout: "card" | "carousel" | "list";
    fontFamily: "inherit" | "inter" | "serif";
    borderRadius: "none" | "small" | "medium" | "large";
    showVerifiedBadge: boolean;
    showRating: boolean;
    showAvatar: boolean;
    showCompany: boolean;
    maxTestimonialsToShow:number
}
const widgetSettingsSchema = new mongoose.Schema<IWidgetSettings>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        // unique:true
    },
    primaryColor: {
        type: String,
        default: "#C96B3F",
        validate: {
            validator: function (value: string) {
                return /^#([0-9A-F]{3}){1,2}$/i.test(value);
            },
            message:"Invalid hex color"
        }
    },

    theme: {
        type: String,
        enum: {
            values: ["light", "dark"],
            message:"Invalid theme"
        },
        default:"light"
    },

    layout: {
        type: String,
        enum: {
            values: ["card", "carousel","list"],
            message:"Invalid layout"
        },
        default:"card"
    },
    fontFamily: {
        type: String,
        enum: {
            values: ["inherit", "inter", "serif"],
            message:"Invalid font family"
        },
        default:"inherit"
    },
    borderRadius: {
        type: String,
        enum: {
            values: ["none", "small", "medium", "large"],
            message:"Invalid border radius"
        },
        default:"medium"
    },
    showVerifiedBadge: {
        type: Boolean,
        default:true
    },
    showRating: {
        type: Boolean,
        default:true
    },
    showAvatar: {
        type: Boolean,
        default:true
    },
    showCompany: {
        type: Boolean,
        default:true
    },
    maxTestimonialsToShow: {
        type: Number,
        default: 3,
        min: [1, "Must show at least 1 testimonial"],
        max:[10,"Cannot show more than 10 testimonials"]
    }
}, { timestamps: true })

widgetSettingsSchema.index({ owner: 1 }, { unique: true })

const WidgetSettings = mongoose.model<IWidgetSettings>("WidgetSettings", widgetSettingsSchema);
export default WidgetSettings