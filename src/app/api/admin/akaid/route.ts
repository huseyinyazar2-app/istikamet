import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { statement, isTrue, explanation, proof } = await req.json();
    await turso.execute({
      sql: "INSERT INTO akaid_cards (statement, is_true, explanation, proof) VALUES (?, ?, ?, ?)",
      args: [statement, isTrue ? 1 : 0, explanation, proof]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add akaid card" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await turso.execute({
      sql: "DELETE FROM akaid_cards WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, statement, isTrue, explanation, proof } = await req.json();
    if (!id || !statement) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    await turso.execute({
      sql: "UPDATE akaid_cards SET statement = ?, is_true = ?, explanation = ?, proof = ? WHERE id = ?",
      args: [statement, isTrue ? 1 : 0, explanation, proof, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
