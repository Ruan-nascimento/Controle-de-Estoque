import { prisma } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const typesPromise = prisma.item.findMany({
      select: { type: true },
      distinct: ['type'],
    });
    const flavorsPromise = prisma.item.findMany({
      select: { flavor: true },
      distinct: ['flavor'],
    });
    const statusesPromise = prisma.item.findMany({
      select: { status: true },
      distinct: ['status'],
    });

    const [typesResult, flavorsResult, statusesResult] = await Promise.all([
      typesPromise,
      flavorsPromise,
      statusesPromise,
    ]);

    const types = typesResult.map((item) => item.type).sort();
    const flavors = flavorsResult.map((item) => item.flavor).sort();
    const statuses = statusesResult.map((item) => item.status).sort();

    return NextResponse.json(
      { types, flavors, statuses },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Erro ao buscar opções de filtro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar opções de filtro' },
      { status: 500 }
    );
  }
}