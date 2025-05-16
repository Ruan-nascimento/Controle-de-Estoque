import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {

    try {
        const response = NextResponse.json({ message: 'Cookies Removidos'}, {status: 200})
        const cookies = request.cookies.getAll()

        cookies.forEach(cookie => {
            response.cookies.delete(cookie.name)
        })

        return response
    } catch (error:any) {
        return NextResponse.json(
            {message: 'Erro ao remover cookies'},
            {status: 500}
        )
    }

}