import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid'; // Optional if you want auto-gen, but we will stick to manual/random logic

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { url, shortCode } = body;

    // Basic Validation
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // Regex Validation for Code: [A-Za-z0-9]{6,8}
    // If shortCode is provided, validate it. If not, generate one.
    if (shortCode) {
      const codeRegex = /^[A-Za-z0-9]{6,8}$/;
      if (!codeRegex.test(shortCode)) {
        return NextResponse.json({ error: 'Code must be alphanumeric and 6-8 characters.' }, { status: 422 });
      }
    } else {
       // Simple random generation if not provided
       shortCode = Math.random().toString(36).substring(2, 8);
    }

    // Check for duplicate
    const existing = await prisma.link.findUnique({ where: { shortCode } });
    if (existing) {
      return NextResponse.json({ error: 'Short code already exists' }, { status: 409 });
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: shortCode,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}