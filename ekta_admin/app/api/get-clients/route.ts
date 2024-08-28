import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Fetch clients from the database
    const result = await sql`
      SELECT * FROM clients;
    `;

    // Return the client data as JSON
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    // Handle any errors and return a 500 response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}