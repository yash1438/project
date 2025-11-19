import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({
    where: { shortCode: params.code },
  });

  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(request: Request, { params }: { params: { code: string } }) {
  try {
    await prisma.link.delete({
      where: { shortCode: params.code },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
}