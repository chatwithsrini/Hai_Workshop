export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    dateCreated: Date;
    dateUpdated: Date;
}

export interface IAuthResponse {
    user: Omit<IUser, 'password'>;
    token: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface ISignupCredentials extends ILoginCredentials {
    name: string;
}
