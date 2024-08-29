import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract the ID from the URL path
    console.log("ID:", id);
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Delete the order from the database
    const result = await sql`
      DELETE FROM orders
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}