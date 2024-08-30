import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { name, phone_number, address, date_needed, date_of_event, location_of_event } = await request.json();

    // Log received data for debugging
    console.log("Received client data:", { name, phone_number, address, date_needed, date_of_event, location_of_event });

    // Validate the input
    if (!name || !phone_number || !address || !date_needed || !date_of_event || !location_of_event) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the new client into the database
    const result = await sql`
      INSERT INTO clients (name, phone_number, address, date_needed, date_of_event, location_of_event)
      VALUES (${name}, ${phone_number}, ${address}, ${date_needed}, ${date_of_event}, ${location_of_event})
      RETURNING id, name, phone_number, address, date_needed, date_of_event, location_of_event
    `;

    // Log the result for debugging
    console.log("Database insertion result:", result);

    // Check if a row was inserted
    if (result.rowCount === 0) {
      throw new Error('Failed to insert new client');
    }

    // Return the newly created client
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to add new client:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to add new client';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}