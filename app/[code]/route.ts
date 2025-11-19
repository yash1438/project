import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({
    where: { shortCode: params.code },
  });

  if (!link) {
    return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
  }

  // Increment click count and update timestamp (non-blocking technically preferred, but await is fine for this scale)
  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.originalUrl);
}