import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

interface BodyRequest {
    kind: string
    flavor: string
    status: string
}

export async function POST(request: NextRequest) {
    try{
        const body = (await request.json()) as BodyRequest
        const {flavor, kind, status} = body

        if(!flavor || !kind || !status) {
            return NextResponse.json({message: "Erro no Banco de Dados"}, {status: 400})
        }

        const filter = await prisma.filterStock.create({
            data: {
                id: '1',
                flavor,
                kind,
                status
            }
        })

        return NextResponse.json({message: "Filtro criado com sucesso", filter}, {status:200})
    } catch (error) {
        return NextResponse.json({message: "Erro ao Criar Filtro"}, {status: 500})
    }
}