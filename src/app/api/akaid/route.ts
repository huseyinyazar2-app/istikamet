import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await turso.execute(`
      SELECT id, statement, is_true as isTrue, explanation, proof
      FROM akaid_cards
      ORDER BY id ASC
    `);

    // Gelen veride isTrue 1 veya 0 olarak döner, boolean'a çevirelim
    const cards = res.rows.map(row => ({
      id: row.id,
      statement: row.statement,
      isTrue: row.isTrue === 1,
      explanation: row.explanation,
      proof: row.proof
    }));

    return NextResponse.json({ data: cards });
  } catch (error) {
    console.error("Failed to fetch akaid cards:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
