// src/app/api/media/route.ts

import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    throw new Error('Filename is required'); // Handle the case where filename is null
  }

  if (!request.body) {
    throw new Error('Request body is required'); // Handle the case where request.body is null
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  // Save metadata in database
  const media = await prisma.media.create({
    data: {
      url: blob.url, // Assuming blob.url contains the public URL of the uploaded file
      createdAt: new Date(),
    },
  });

  return NextResponse.json(media);
}
