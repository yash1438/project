import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params; // Await params here

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params; // Await params here

  try {
    await prisma.link.delete({
      where: { shortCode: code },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
}