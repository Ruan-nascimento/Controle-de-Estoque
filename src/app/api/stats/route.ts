// app/api/stats/route.ts
import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

interface RequestProps {
  value: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value } = body;

    if (!value || isNaN(value)) {
      return NextResponse.json(
        { error: "Nenhum valor válido fornecido" },
        { status: 400 }
      );
    }

    const find = await prisma.stats.findUnique({
      where: {
        id: 1,
      },
    });

    if (find) {
      const changeFind = await prisma.stats.update({
        where: {
          id: 1,
        },
        data: {
          meta: value,
        },
      });

      return NextResponse.json(
        { message: "Meta atualizada com sucesso" },
        { status: 200 }
      );
    } else {
      const create = await prisma.stats.create({
        data: {
          id: 1,
          meta: value,
        },
      });

      return NextResponse.json(
        { message: "Meta criada com sucesso" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar meta:", error);
    return NextResponse.json(
      { message: "Erro ao processar meta" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const meta = await prisma.stats.findFirst({
      where: {
        id: 1,
      },
    });

    if (!meta) {
      return NextResponse.json(
        { message: "Nenhuma meta encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Meta encontrada", meta: meta.meta },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar meta:", error);
    return NextResponse.json(
      { message: "Erro ao buscar meta" },
      { status: 500 }
    );
  }
}