import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Token não encontrado' },
                { status: 401 }
            );
        }

        const jwtSecret = process.env.SECRET_KEY;
        
        if (!jwtSecret) {
            throw new Error('SECRET_KEY não configurado no .env');
        }

        const decoded = jwt.verify(token, jwtSecret);
        console.log('Token decodificado:', decoded); 

        return NextResponse.json(
            { message: 'Token válido' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Erro na verificação do token:', error.message);
        return NextResponse.json(
            { error: 'Token inválido ou erro no servidor', details: error.message },
            { status: 500 }
        );
    }
}