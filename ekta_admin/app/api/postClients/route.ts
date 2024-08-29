import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { name, phone, address, shipmentDate, eventDate, eventLocation } = await request.json();
    console.log("name", name);
    console.log("phone_number", phone);
    console.log("address", address);
    console.log("date_needed", shipmentDate);
    console.log("date_of_event", eventDate);
    console.log("location_of_event", eventLocation);

    // Validate the input
    if (!name || !phone || !address || !shipmentDate || !eventDate || !eventLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log(request.json());
    // Insert the new client into the database
    const result = await sql`
      INSERT INTO clients (name, phone_number, address, date_needed, date_of_event, location_of_event)
      VALUES (${name}, ${phone}, ${address}, ${shipmentDate}, ${eventDate}, ${eventLocation})
      RETURNING id, name, phone_number, address, date_needed, date_of_event, location_of_event
    `;

    // Return the newly created client
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to add new client:', error);
    console.log(request.json());
    return NextResponse.json({ error: 'Failed to add new client' }, { status: 500 });
  }
}