export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    isVerified: boolean;
    role: "owner" | "admin";
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IQuestion{
    question: string;
    required: boolean;
    type: "text" | "textarea" | "rating";
}

export interface ITestimonialRequest{
    _id: string;
    owner: string;
    title: string;
    token: string;
    questions: IQuestion[];
    status: "ACTIVE" | "CLOSED";
    theme: "light" | "dark";
    allowAnonymous: boolean;
    expiresAt?: string | null;
    submissionCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface IAnswer{
    question: string;
    answer:string
}

export interface IGeneratedTestimonial{
    content: string;
    tone: "casual" | "professional" | "emotional";
    createdAt:string
}

export interface ITestimonialResponse{
    _id: string;
    request: string | ITestimonialRequest;
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
    createdAt: string;
    updatedAt: string;
}

export interface IWidgetSettings{
    _id: string;
    owner: string;
    primaryColor: string;
    theme: "light" | "dark";
    layout: "card" | "carousel" | "list";
    fontFamily: "inherit" | "inter" | "serif";
    borderRadius: "none" | "small" | "medium" | "large";
    showVerifiedBadge: boolean;
    showRating: boolean;
    showAvatar: boolean;
    showCompany: boolean;
    maxTestimonialsToShow: boolean;
}

export interface IDashboardStats{
    totalRequests: number;
    activeRequests: number;
    totalSubmissions: number;
    pendingReview: number;
    approved: number;
    rejected: number;
    published: number;
    averageRating:number
}

export interface IApiResponse<T = unknown>{
    success: boolean;
    message: string;
    data?: T;
    pagination?: IPagination;
}

export interface IPagination{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface IFilters{
    status?: "PENDING" | "APPROVED" | "REJECTED";
    isPublished?: boolean;
    requestId?: string;
    page: number;
    limit: number;
    sortBy: "createdAt" | "rating";
    order:"asc"| "desc"
}