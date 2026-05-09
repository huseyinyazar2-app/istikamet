import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { text, categoryName, type, weight, reflection1, reflection2 } = await req.json();
    const catRes = await turso.execute({ sql: "SELECT id FROM categories WHERE name = ?", args: [categoryName] });
    let catId = 1; 
    if (catRes.rows.length > 0) catId = catRes.rows[0].id as number;

    await turso.execute({
      sql: "INSERT INTO cards (category_id, text, type, weight, reflection_1, reflection_2) VALUES (?, ?, ?, ?, ?, ?)",
      args: [catId, text, type, weight || 1, reflection1 || '', reflection2 || '']
    });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Failed to add card" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await turso.execute({ sql: "DELETE FROM reflections WHERE card_id = ?", args: [id] });
    await turso.execute({ sql: "DELETE FROM cards WHERE id = ?", args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Failed to delete" }, { status: 500 }); }
}

export async function PUT(req: Request) {
  try {
    const { id, text, weight, reflection1, reflection2 } = await req.json();
    if (!id || !text) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    await turso.execute({
      sql: "UPDATE cards SET text = ?, weight = ?, reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [text, weight, reflection1 || '', reflection2 || '', id]
    });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 }); }
}
