import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await turso.execute("SELECT * FROM arinma");
    const data = res.rows.map(row => ({
      id: row.id,
      title: row.title,
      action: row.action,
      isHeavy: Boolean(row.is_heavy)
    }));
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, action, isHeavy } = await req.json();
    await turso.execute({
      sql: "INSERT INTO arinma (title, action, is_heavy) VALUES (?, ?, ?)",
      args: [title, action, isHeavy ? 1 : 0]
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
      sql: "DELETE FROM arinma WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, action, isHeavy } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await turso.execute({
      sql: "UPDATE arinma SET title = ?, action = ?, is_heavy = ? WHERE id = ?",
      args: [title, action, isHeavy ? 1 : 0, id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
