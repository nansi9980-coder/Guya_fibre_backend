export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    EDITOR = "EDITOR",
    VIEWER = "VIEWER"
}
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    isActive?: boolean;
    password?: string;
}
export declare class UserQueryDto {
    page?: number;
    limit?: number;
    role?: Role;
    isActive?: boolean;
    search?: string;
}
