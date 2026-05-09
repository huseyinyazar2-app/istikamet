import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { cardId, text } = await req.json();
    if (!text || !cardId) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    await turso.execute({ sql: "INSERT INTO reflections (card_id, text) VALUES (?, ?)", args: [cardId, text] });
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: "Hatali islem" }, { status: 500 }); 
  }
}

export async function PUT(req: Request) {
  try {
    const { id, cardId, text } = await req.json();
    if (!id || !text || !cardId) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    await turso.execute({ sql: "UPDATE reflections SET card_id = ?, text = ? WHERE id = ?", args: [cardId, text, id] });
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: "Hatali islem" }, { status: 500 }); 
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await turso.execute({ sql: "DELETE FROM reflections WHERE id = ?", args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 }); 
  }
}
