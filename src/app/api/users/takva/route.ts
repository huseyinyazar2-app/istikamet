import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get('nickname');
    if (!nickname) return NextResponse.json({ data: [] });

    const res = await turso.execute({
      sql: "SELECT id, category_name as categoryName, text FROM user_takva_cards WHERE nickname = ?",
      args: [nickname]
    });

    const data = res.rows.map(row => ({
      id: row.id,
      categoryName: row.categoryName,
      text: row.text,
      // Kullanıcıların eklediği Sevaplar +1, Günahlar -1 kabul ediliyor.
      weight: row.categoryName === 'Günahlar' ? -1 : 1,
      isTakva: true,
      isCustom: true
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nickname, categoryName, text } = await req.json();
    if (!nickname || !text || !categoryName) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    // Eğer kullanıcı eski bir session'daysa ve DB'de kayıtlı değilse Foreign Key hatası almamak için:
    await turso.execute({
      sql: "INSERT OR IGNORE INTO users (nickname) VALUES (?)",
      args: [nickname]
    });

    await turso.execute({
      sql: "INSERT INTO user_takva_cards (nickname, category_name, text) VALUES (?, ?, ?)",
      args: [nickname, categoryName, text]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Takva Ekleme Hatası:", error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const nickname = searchParams.get('nickname');
    if (!id || !nickname) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    await turso.execute({
      sql: "DELETE FROM user_takva_cards WHERE id = ? AND nickname = ?",
      args: [id, nickname]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
