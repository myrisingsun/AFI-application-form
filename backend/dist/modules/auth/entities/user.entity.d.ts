export declare enum UserRole {
    ADMIN = "admin",
    RECRUITER = "recruiter",
    SECURITY = "security",
    VIEWER = "viewer"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
