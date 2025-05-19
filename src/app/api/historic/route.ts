import { prisma } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
    
    try {
        const itemsSelled = await prisma.sale.findMany({
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if(!itemsSelled) {
            return NextResponse.json({message: 'Erro ao encontrar items'}, {status: 400})
        }

        return NextResponse.json(
            itemsSelled,
            {status: 200}
        )
    } catch (error){
        return NextResponse.json({message: 'Erro no servidor...'}, {status: 500})
    }

}