import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let result;

    if (clientId) {
      result = await sql`
        SELECT 
          c.id AS client_id,
          c.name,
          c.phone_number,
          c.address,
          c.date_needed,
          c.date_of_event,
          c.location_of_event,
          o.id AS order_id,
          o.client_name,
          o.date AS order_date,
          o.item_name,
          o.tailor_name,
          o.total_cost,
          i.id AS item_id,
          i.fabric_source,
          i.fabric_meters,
          i.cost_per_meter,
          i.stitching_cost,
          i.embellishment_cost,
          i.description
        FROM 
          clients c
        LEFT JOIN 
          orders o ON c.id = o.client_id
        LEFT JOIN
          items i ON o.id = i.order_id
        WHERE 
          c.id = ${clientId}
        ORDER BY 
          c.id, o.id, i.id;
      `;
    } else {
      result = await sql`
        SELECT 
          c.id AS client_id,
          c.name,
          c.phone_number,
          c.address,
          c.date_needed,
          c.date_of_event,
          c.location_of_event,
          o.id AS order_id,
          o.client_name,
          o.date AS order_date,
          o.item_name,
          o.tailor_name,
          o.total_cost,
          i.id AS item_id,
          i.fabric_source,
          i.fabric_meters,
          i.cost_per_meter,
          i.stitching_cost,
          i.embellishment_cost,
          i.description
        FROM 
          clients c
        LEFT JOIN 
          orders o ON c.id = o.client_id
        LEFT JOIN
          items i ON o.id = i.order_id
        ORDER BY 
          c.id, o.id, i.id;
      `;
    }

    // Output the raw results to check the name values
    console.log('Query result:', JSON.stringify(result, null, 2));

    // Transform results into a nested structure with clients and their orders
    const clients = result.rows.reduce((acc, row) => {
      const clientIndex = acc.findIndex((c: { client_id: any; }) => c.client_id === row.client_id);
      const order = row.order_id ? {
        id: row.order_id,
        client_name: row.client_name,
        date: row.order_date,
        item_name: row.item_name,
        tailor_name: row.tailor_name,
        total_cost: row.total_cost,
        items: row.item_id ? [{
          id: row.item_id,
          fabric_source: row.fabric_source,
          fabric_meters: row.fabric_meters,
          cost_per_meter: row.cost_per_meter,
          stitching_cost: row.stitching_cost,
          embellishment_cost: row.embellishment_cost,
          description: row.description,
        }] : []
      } : null;

      if (clientIndex === -1) {
        // Add new client entry
        acc.push({
          client_id: row.client_id,
          name: row.name,  // Directly using 'name'
          phone_number: row.phone_number,
          address: row.address,
          date_needed: row.date_needed,
          date_of_event: row.date_of_event,
          location_of_event: row.location_of_event,
          orders: order ? [order] : [], // Initialize orders array, only add if order exists
        });
      } else if (order) {
        const existingOrderIndex = acc[clientIndex].orders.findIndex((o: { id: any; }) => o.id === order.id);
        
        if (existingOrderIndex === -1) {
          acc[clientIndex].orders.push(order);
        } else if (row.item_id) {
          acc[clientIndex].orders[existingOrderIndex].items.push({
            id: row.item_id,
            fabric_source: row.fabric_source,
            fabric_meters: row.fabric_meters,
            cost_per_meter: row.cost_per_meter,
            stitching_cost: row.stitching_cost,
            embellishment_cost: row.embellishment_cost,
            description: row.description,
          });
        }
      }

      return acc;
    }, []);

    return NextResponse.json(clients);
  } catch (error) {
    // Type-check the error to ensure it's an instance of Error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch clients with orders', details: error.message },
        { status: 500 }
      );
    } else {
      // Handle the case where the error is not an instance of Error
      return NextResponse.json(
        { error: 'An unknown error occurred', details: 'No error details available' },
        { status: 500 }
      );
    }
  }
}
