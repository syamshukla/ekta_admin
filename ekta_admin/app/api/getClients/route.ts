import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    let query: string;
    let queryParams: any[] = [];

    if (clientId) {
      // Fetch a specific client and their orders
      query = `
        SELECT 
          c.id AS client_id,
          c.name AS client_name,
          c.phone_number,
          c.address,
          c.date_needed,
          c.date_of_event,
          c.location_of_event,
          o.id AS order_id,
          o.name,
          o.item_name,
          o.fabric_meters,
          o.cost_per_meter,
          o.total_cost,
          o.stitching_cost,
          o.embellishment_cost,
          o.tailor_name,
          o.fabric_source
        FROM 
          clients c
        LEFT JOIN 
          orders o ON c.id = o.client_id
        WHERE 
          c.id = $1
        ORDER BY 
          c.id;
      `;
      queryParams = [clientId];
    } else {
      // Fetch all clients and their orders
      query = `
        SELECT 
          c.id AS client_id,
          c.name AS client_name,
          c.phone_number,
          c.address,
          c.date_needed,
          c.date_of_event,
          c.location_of_event,
          o.id AS order_id,
          o.name,
          o.item_name,
          o.fabric_meters,
          o.cost_per_meter,
          o.total_cost,
          o.stitching_cost,
          o.embellishment_cost,
          o.tailor_name,
          o.fabric_source
        FROM 
          clients c
        LEFT JOIN 
          orders o ON c.id = o.client_id
        ORDER BY 
          c.id;
      `;
    }

    const result = await sql.query(query, queryParams);
    console.log(result);

    // Transform results into a nested structure with clients and their orders
    const clients = result.rows.reduce((acc, row) => {
      const clientIndex = acc.findIndex((c: { client_id: any; }) => c.client_id === row.client_id);
      const order = {
        id: row.order_id,
        name: row.name,
        item_name: row.item_name,
        fabric_meters: row.fabric_meters,
        cost_per_meter: row.cost_per_meter,
        total_cost: row.total_cost,
        stitching_cost: row.stitching_cost,
        embellishment_cost: row.embellishment_cost,
        tailor_name: row.tailor_name,
        fabric_source: row.fabric_source,
      };

      if (clientIndex === -1) {
        // Add new client entry
        acc.push({
          client_id: row.client_id,
          client_name: row.client_name,
          phone_number: row.phone_number,
          address: row.address,
          date_needed: row.date_needed,
          date_of_event: row.date_of_event,
          location_of_event: row.location_of_event,
          orders: row.order_id ? [order] : [], // Initialize orders array, only add if order exists
        });
      } else {
        // Append order to existing client
        if (row.order_id) acc[clientIndex].orders.push(order);
      }

      return acc;
    }, []);

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients with orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients with orders" },
      { status: 500 }
    );
  }
}