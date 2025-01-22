import jwt from 'jsonwebtoken';
import Users from '../models/users';

interface User {
    email: string; 
    name: string;
}

export const generateToken = (user: User) => {
    const payload = {
        email: user.email,
        name: user.name,
    };

    // Make sure the JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return token;
};
