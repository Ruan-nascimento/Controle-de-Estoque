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
        return NextResponse.json(
            { error: "Erro de configuração do servidor" },
            { status: 500 }
        );
    }

        const decoded = jwt.verify(token, jwtSecret);

        return NextResponse.json(
            { message: 'Token válido', user: decoded },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Erro na verificação do token:", error.message);
        return NextResponse.json(
          {
            error: "Token inválido ou expirado",
            details: error.message,
          },
          { status: 401 }
        );
      }
}