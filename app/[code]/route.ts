import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  // NEW: We must await the params object now
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
  }

  // Update stats
  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.originalUrl);
}