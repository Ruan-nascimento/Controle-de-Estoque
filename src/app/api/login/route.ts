import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

const generatePasswordHash = async (password: string) => {
    return await bcrypt.hash(password, 10);
};


const PASSWORD_HASH = await generatePasswordHash(process.env.PASSWORD as string);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { error: 'Senha é obrigatória' },
                { status: 400 }
            );
        }

        const storedPasswordHash = process.env.PASSWORD_HASH || PASSWORD_HASH;
        const jwtSecret = process.env.SECRET_KEY;

        if (!storedPasswordHash || !jwtSecret) {
            return NextResponse.json(
                { error: 'Configuração do servidor incompleta' },
                { status: 500 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Senha inválida' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { authenticated: true },
            jwtSecret,
            { expiresIn: '1d' }
        );

        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
        });

        const response = NextResponse.json(
            { message: 'Autenticação bem-sucedida' },
            { status: 200 }
        );

        response.headers.set('Set-Cookie', cookie);
        return response;

    } catch (error: any) {
        console.error('Erro na autenticação:', error.message); 
        return NextResponse.json(
            { error: 'Erro interno do servidor', details: error.message },
            { status: 500 }
        );
    }
}

interface AuthRequestBody {
    password: string;
}