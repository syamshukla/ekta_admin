import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PATCH(request: Request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Construct the SQL query for updating fields
    const setClause = Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(updateData);

    const result = await sql`
      UPDATE orders
      SET ${sql(setClause, values)}
      WHERE id = ${id}
      RETURNING id, name, item_name, fabric_meters, cost_per_meter, total_cost, stitching_cost, embellishment_cost, tailor_name, fabric_source, description;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}