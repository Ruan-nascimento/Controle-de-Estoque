import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    try {
        const auth = request.cookies.get('auth_token')?.value
        const user = request.cookies.get('user_token')?.value


        if (!auth && !user) {
            console.log('Não tem token')
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

        if(user) {

            const decoded = jwt.verify(user, jwtSecret);
            return NextResponse.json(
            { message: 'Token válido', user: decoded, name: 'user_token'},
            { status: 200 }
        );
        } 
        else {

            const decoded = jwt.verify(auth!, jwtSecret);
            return NextResponse.json(
            { message: 'Token válido', user: decoded, name: 'auth_token'},
            { status: 200 })

        }

        

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