import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Request Data:", data);

    const {
      client_id,
      client_name,
      date_needed,
      date_of_event,
      item_name,
      tailor_name,
      total_cost,
      status,
      items
    } = data;

    // Validate the input
    if (
      !client_id ||
      !client_name ||
      !date_needed ||
      !date_of_event ||
      !item_name ||
      !tailor_name ||
      !total_cost ||
      !status ||
      !items || items.length === 0
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    // Start a transaction
    await sql`BEGIN`;

    try {
      // Insert the new order into the database
      const orderResult = await sql`
        INSERT INTO orders (
          client_id, 
          client_name, 
          date_needed, 
          date_of_event, 
          item_name, 
          tailor_name, 
          total_cost,
          status
        )
        VALUES (
          ${client_id}, 
          ${client_name}, 
          ${date_needed}, 
          ${date_of_event}, 
          ${item_name}, 
          ${tailor_name}, 
          ${total_cost},
          ${status}
        )
        RETURNING id
      `;

      const orderId = orderResult.rows[0].id;

      // Insert items into the items table
      for (const item of items) {
        await sql`
          INSERT INTO items (
            order_id, 
            fabric_source, 
            fabric_meters, 
            cost_per_meter, 
            stitching_cost, 
            embellishment_cost, 
            description
          )
          VALUES (
            ${orderId}, 
            ${item.fabric_source}, 
            ${item.fabric_meters}, 
            ${item.cost_per_meter}, 
            ${item.stitching_cost}, 
            ${item.embellishment_cost}, 
            ${item.description}
          )
        `;
      }

      // Commit the transaction
      await sql`COMMIT`;

      // Fetch the complete order with items to return as a response
      const result = await sql`
        SELECT 
          o.*, 
          json_agg(
            json_build_object(
              'id', i.id,
              'fabric_source', i.fabric_source,
              'fabric_meters', i.fabric_meters,
              'cost_per_meter', i.cost_per_meter,
              'stitching_cost', i.stitching_cost,
              'embellishment_cost', i.embellishment_cost,
              'description', i.description
            )
          ) AS items
        FROM 
          orders o
        LEFT JOIN 
          items i ON o.id = i.order_id
        WHERE 
          o.id = ${orderId}
        GROUP BY 
          o.id
      `;

      // Return the newly created order with items
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      // Rollback the transaction in case of error
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error('Failed to add new order:', error.message);
      return NextResponse.json(
        { error: 'Failed to add new order', details: error.message },
        { status: 500 }
      );
    } else {
      // Handle the case where the error is not an instance of Error
      console.error('Failed to add new order: An unknown error occurred');
      return NextResponse.json(
        { error: 'Failed to add new order', details: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}