import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cardsResult = await turso.execute(`
      SELECT c.id, c.text, c.type, c.weight, c.reflection_1 as reflection1, c.reflection_2 as reflection2, cat.name as categoryName
      FROM cards c
      JOIN categories cat ON c.category_id = cat.id
    `);

    const takvaResult = await turso.execute(`
      SELECT id, text, category_name as categoryName, description, weight, reflection_1 as reflection1, reflection_2 as reflection2
      FROM takva_cards
    `);

    const cards = cardsResult.rows.map(row => ({
      id: row.id,
      text: row.text,
      type: row.type,
      weight: row.weight,
      categoryName: row.categoryName,
      reflection1: row.reflection1,
      reflection2: row.reflection2
    }));

    const takvaCards = takvaResult.rows.map(row => ({
      id: `takva_${row.id}`,
      text: row.text,
      categoryName: row.categoryName,
      description: row.description,
      weight: row.weight,
      reflection1: row.reflection1,
      reflection2: row.reflection2,
      isTakva: true
    }));

    return NextResponse.json({ cards, takvaCards });
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
