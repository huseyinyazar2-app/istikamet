import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { categoryName, text, description, weight, reflection1, reflection2 } = await req.json();
    await turso.execute({
      sql: "INSERT INTO takva_cards (category_name, text, description, weight, reflection_1, reflection_2) VALUES (?, ?, ?, ?, ?, ?)",
      args: [categoryName, text, description, weight, reflection1 || '', reflection2 || '']
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add takva card" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await turso.execute({
      sql: "DELETE FROM takva_cards WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, text, weight, description, reflection1, reflection2 } = await req.json();
    if (!id || !text) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    await turso.execute({
      sql: "UPDATE takva_cards SET text = ?, weight = ?, description = ?, reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [text, weight, description, reflection1 || '', reflection2 || '', id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
