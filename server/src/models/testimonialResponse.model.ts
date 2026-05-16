import mongoose from "mongoose";

interface IAnswer {
  question: string;
  answer: string;
}

interface IGeneratedTestimonial {
  content: string;
  tone: "casual" | "professional" | "emotional";
  createdAt: Date;
}

interface ITestimonialResponse {
  request: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  clientAvatar?: string;
  rating: number;
  answers: IAnswer[];
  generatedTestimonials: IGeneratedTestimonial[];
  approvedTestimonial: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isPublished: boolean;
}
const answerSchema = new mongoose.Schema<IAnswer>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Answer cannot be empty"],
      maxlength: [2000, "Answer too long"],
    },
  },
  { _id: false },
);

const generatedTestimonialSchema = new mongoose.Schema<IGeneratedTestimonial>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [20, "Generated testimonial too short"],
      maxlength: [3000, "Generated testimonial too long"],
    },
    tone: {
      type: String,
      enum: {
        values: ["casual", "professional", "emotional"],
        message: "Invalid testimonial tone",
      },
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const testimonialResponseSchema = new mongoose.Schema<ITestimonialResponse>(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestimonialRequest",
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Client name too short"],
      maxlength: [50, "Client name too long"],
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          if (!value) return true;

          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    clientCompany: {
      type: String,
      trim: true,
      maxlength: [100, "Company name too long"],
    },
    clientAvatar: {
      type: String,
      trim: true,
      default:null
    },
    rating: {
      type: Number,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
      default: 5,
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: function (value: IAnswer[]) {
          return value.length >= 1;
        },
        message: "At least one answer is required",
      },
    },

    generatedTestimonials: {
      type: [generatedTestimonialSchema],
      default: [],
      validate: {
        validator: function (value: IGeneratedTestimonial[]) {
          return value.length<=3
        },
        message:"Cannot store more than 3 generated testimonials"
      }
    },

    approvedTestimonial: {
      type: String,
      trim: true,
      maxlength: [3000, "Approved testimonial too long"],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED"],
        message: "Invalid status",
      },
      default: "PENDING",
    },
    isPublished: {
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  },
);


const TestimonialResponse = mongoose.model<ITestimonialResponse>("TestimonialResponse", testimonialResponseSchema);

export default TestimonialResponse;