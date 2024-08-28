import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');
  const event_date = searchParams.get('event_date');
  const shipment_date = searchParams.get('shipment_date');
  const event_location = searchParams.get('event_location');

  try {
    if (!name || !phone || !address || !event_date || !shipment_date || !event_location) {
      throw new Error('All fields are required');
    }

    await sql`
      INSERT INTO Clients (name, phone, address, event_date, shipment_date, event_location)
      VALUES (${name}, ${phone}, ${address}, ${event_date}, ${shipment_date}, ${event_location});
    `;

    return NextResponse.json({ message: 'Client added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}