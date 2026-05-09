import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { nickname, message } = await req.json();
    if (!message) return NextResponse.json({ error: "Mesaj boş olamaz" }, { status: 400 });

    await turso.execute({
      sql: "INSERT INTO feedback (nickname, message) VALUES (?, ?)",
      args: [nickname || 'Anonim', message]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
