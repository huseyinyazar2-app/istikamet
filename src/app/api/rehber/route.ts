import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await turso.execute("SELECT * FROM rehber");
    const data = res.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      cure: row.cure
    }));
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, cure } = await req.json();
    await turso.execute({
      sql: "INSERT INTO rehber (title, description, cure) VALUES (?, ?, ?)",
      args: [title, description, cure]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await turso.execute({
      sql: "DELETE FROM rehber WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, cure } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await turso.execute({
      sql: "UPDATE rehber SET title = ?, description = ?, cure = ? WHERE id = ?",
      args: [title, description, cure, id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
