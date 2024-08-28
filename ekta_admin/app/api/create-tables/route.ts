import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Create Clients table
    await sql`
      CREATE TABLE IF NOT EXISTS Clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        event_date DATE,
        shipment_date DATE,
        event_location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Outfits table with additional fields
    await sql`
      CREATE TABLE IF NOT EXISTS Outfits (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES Clients(id),
        garment_title VARCHAR(255),
        tailor_name VARCHAR(255),
        fabric_source VARCHAR(255),
        fabric_meters DECIMAL(10, 2),
        fabric_cost_per_meter DECIMAL(10, 2),
        fabric_cost_inr DECIMAL(10, 2),
        fabric_cost_usd DECIMAL(10, 2),
        stitching_cost_inr DECIMAL(10, 2),
        stitching_cost_usd DECIMAL(10, 2),
        is_padded BOOLEAN,
        has_kan_kan BOOLEAN,
        embellishments TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Tables created successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}