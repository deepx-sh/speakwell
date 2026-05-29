import mongoose from "mongoose";

interface IQuestion {
  question: string;
  required: boolean;
  type: "text" | "textarea" | "rating";
}

export interface ITestimonialRequest {
  owner: mongoose.Types.ObjectId;
  title: string;
  token: string;
  questions: IQuestion[];
  status: "ACTIVE" | "CLOSED";
  expiresAt: Date | null;
  theme: "light" | "dark";
  allowAnonymous: boolean;
  submissionCount: number;
}

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [5, "Question too short"],
      maxlength: [200, "Question too long"],
    },
    required: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: {
        values: ["text", "textarea", "rating"],
        message: "Invalid question type",
      },
      default: "textarea",
    },
  },
  { _id: false },
);

const testimonialRequestSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title too short"],
      maxlength: [100, "Title too long"],
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 6,
    },
    questions: {
      type: [questionSchema],
      required:[true,"Questions are required"],
      validate: {
        validator: function (value: IQuestion[]) {
          return value.length >= 1 && value.length <= 8;
        },
        message: "Questions must be between 1 and 8",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "CLOSED"],
        message: "Invalid status",
      },
      default: "ACTIVE",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    theme: {
      type: String,
      enum: {
        values: ["light", "dark"],
        message: "Invalid theme",
      },
      default: "light",
    },
    allowAnonymous: {
      type: Boolean,
      default:false
    },
    submissionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

testimonialRequestSchema.index({ status: 1 })

testimonialRequestSchema.pre(/^find/, async function () {
  await TestimonialRequest.updateMany(
    {
      status: "ACTIVE",
      expiresAt: { $lt: new Date(), $ne:null}
    },
    {
      status:"CLOSED"
    }
  )
  
})

testimonialRequestSchema.set("toJSON", {
  transform:function(_doc,ret){
    delete (ret as any).__v;
    return ret;
  }
})
const TestimonialRequest = mongoose.model<ITestimonialRequest>(
  "TestimonialRequest",
  testimonialRequestSchema,
);
export default TestimonialRequest;
