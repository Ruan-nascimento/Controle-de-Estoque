import { prisma } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  start: string;
  end: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { start, end } = body;

    if (!start || !end) {
      return NextResponse.json(
        { error: 'As datas inicial e final são obrigatórias' },
        { status: 400 }
      );
    }


    const consult = await prisma.filterHistoric.findFirst({
        where: {
            id: '1'
        }
    })

    if(consult) {
        const filter = await prisma.filterHistoric.update({
            where:{
                id: '1'
            },
            data: {
                start,
                end,
            },
        });
        return NextResponse.json(
          { message: 'Filtro salvo com sucesso', filter },
          { status: 201 })
    } else {

        const filter = await prisma.filterHistoric.create({
          data: {
            id: '1',
            start,
            end,
          },
        });
        return NextResponse.json(
          { message: 'Filtro salvo com sucesso', filter },
          { status: 201 })
    }


  } catch (error: unknown) {
    console.error('Erro ao salvar período:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao salvar período no banco de dados', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const filter = await prisma.filterHistoric.findFirst({
            where: {
                id: '1'
            },
            
        })

        if(!filter) {
            return NextResponse.json({message: 'Filtro Não Encotrado'}, {status: 400})
        }

        return NextResponse.json({message: 'Filtro Encontrado', filter}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Erro no servidor'}, {status: 500})
    }
}

export async function DELETE() {
    try {
        const delet = await prisma.filterHistoric.delete({
            where: {
                id: '1'
            }
        })
        if(!delet) {
                return NextResponse.json({message: 'Filtro Não Encotrado'}, {status: 400})
            }

        return NextResponse.json({message: 'Filtro deletado com sucesso'}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Erro no servidor'}, {status: 500})
    }
}