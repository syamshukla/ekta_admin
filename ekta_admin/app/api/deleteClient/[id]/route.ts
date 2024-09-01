import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract the ID from the URL path

    console.log("Client ID:", id);

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Start a transaction
    await sql`BEGIN;`;

    // Delete items related to the orders of the client
    await sql`
      DELETE FROM items
      WHERE order_id IN (
        SELECT id FROM orders WHERE client_id = ${id}
      );
    `;

    // Delete the orders of the client
    await sql`
      DELETE FROM orders
      WHERE client_id = ${id};
    `;

    // Delete the client
    const result = await sql`
      DELETE FROM clients
      WHERE id = ${id}
      RETURNING id;
    `;

    // Commit the transaction
    await sql`COMMIT;`;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' }, { status: 200 });
  } catch (error) {
    // Rollback the transaction in case of error
    await sql`ROLLBACK;`;

    console.error('Failed to delete client:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
