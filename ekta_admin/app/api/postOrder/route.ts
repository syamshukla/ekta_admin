import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Request Data:", data);

    const {
      client_name,
      client_id,
      item_name,
      fabric_meters,
      cost_per_meter,
      stitching_cost,
      embellishment_cost,
      tailor_name,
      fabric_source,
      additional_embellishment,
         description
    } = data;

    console.log("client_name:", client_name);
    console.log("client_id:", client_id);
    console.log("item_name:", item_name);
    console.log("fabric_meters:", fabric_meters);
    console.log("cost_per_meter:", cost_per_meter);
    console.log("stitching_cost:", stitching_cost);
    console.log("embellishment_cost:", embellishment_cost);
    console.log("tailor_name:", tailor_name);
    console.log("fabric_source:", fabric_source);
    console.log("additional_embellishment:", additional_embellishment);

    // Convert to numbers where applicable
    const parsedFabricMeters = parseFloat(fabric_meters);
    const parsedCostPerMeter = parseFloat(cost_per_meter);
    const parsedStitchingCost = parseFloat(stitching_cost);
    const parsedEmbellishmentCost = parseFloat(embellishment_cost);

    // Calculate total cost
    const total_cost = parsedFabricMeters * parsedCostPerMeter + parsedStitchingCost + parsedEmbellishmentCost;

    // Validate the input
    if (
      !client_name ||
      !client_id ||
      !item_name ||
      isNaN(parsedFabricMeters) ||
      isNaN(parsedCostPerMeter) ||
      isNaN(parsedStitchingCost) ||
      isNaN(parsedEmbellishmentCost) ||
      !tailor_name ||
      !fabric_source
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    // Insert the new order into the database
    const result = await sql`
      INSERT INTO orders (
        name,
        client_id,
        item_name,
        fabric_meters,
        cost_per_meter,
        total_cost,
        stitching_cost,
        embellishment_cost,
        tailor_name,
        fabric_source,
         description
      )
      VALUES (
        ${client_name},
        ${client_id},
        ${item_name},
        ${parsedFabricMeters},
        ${parsedCostPerMeter},
        ${total_cost},
        ${parsedStitchingCost},
        ${parsedEmbellishmentCost},
        ${tailor_name},
        ${fabric_source},
        ${ description}
      )
      RETURNING id, name, client_id, item_name, fabric_meters, cost_per_meter, total_cost, stitching_cost, embellishment_cost, tailor_name, fabric_source,  description
    `;

    // Return the newly created order
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to add new order:', error);
    return NextResponse.json({ error: 'Failed to add new order' }, { status: 500 });
  }
}