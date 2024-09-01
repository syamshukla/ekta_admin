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

    // First, delete items related to the order
    const deleteItemsResult = await sql`
      DELETE FROM items
      WHERE order_id = ${id}
      RETURNING id;
    `;

    // Log the result of item deletion
    if (deleteItemsResult.rowCount === 0) {
      console.log("No items found for this order.");
    } else {
      console.log("Deleted items:", deleteItemsResult);
    }

    // Then, delete the order itself
    const deleteOrderResult = await sql`
      DELETE FROM orders
      WHERE id = ${id}
      RETURNING id;
    `;

    if (deleteOrderResult.rowCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order and related items deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete order and related items:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
