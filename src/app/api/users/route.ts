import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { nickname } = await req.json();
    if (!nickname) return NextResponse.json({ error: "Rumuz gerekli" }, { status: 400 });

    // Check if it exists
    const res = await turso.execute({
      sql: "SELECT id FROM users WHERE nickname = ?",
      args: [nickname]
    });

    if (res.rows.length > 0) {
      return NextResponse.json({ error: "Bu rumuz dolu, lütfen başka bir rumuz seç." }, { status: 409 });
    }

    // Insert new user
    await turso.execute({
      sql: "INSERT INTO users (nickname) VALUES (?)",
      args: [nickname]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
