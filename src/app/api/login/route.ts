import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';


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

        const admPassword = process.env.PASSWORD_ADM;
        const userPassword = process.env.PASSWORD;
        const jwtSecret = process.env.SECRET_KEY;

        if (!admPassword || !jwtSecret || !userPassword) {
            return NextResponse.json(
                { error: 'Configuração do servidor incompleta' },
                { status: 500 }
            );
        }

        const token = jwt.sign(
            { authenticated: true },
            jwtSecret,
            { expiresIn: '1d' }
        );


        if (password === admPassword) {
            const cookie = serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60,
                path: '/',
                sameSite: 'strict'
            })

            const response = NextResponse.json({message: 'Adm Autenticado com Sucesso!'}, {status: 200})

            response.headers.set('Set-Cookie', cookie)

            return response

        } else if (password === userPassword) {
            const cookie = serialize('user_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60,
                path: '/',
                sameSite: 'strict'
            })

            const response = NextResponse.json({message: 'Usuário Autenticado com Sucesso!'}, {status: 200})

            response.headers.set('Set-Cookie', cookie)

            return response

        } else {
            return NextResponse.json({error: 'Senha Inválida'}, {status: 400})
        }


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