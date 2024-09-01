// pages/board.tsx
"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KanbanOrder {
  id: string;
  item_name: string;
  status: string;
  date_needed: string;
  date_of_event: string;
  total_cost: string;
}

const Board: React.FC = () => {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);
  const columns = ["not_started", "in_progress", "done"];

  // Fetch data from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/getClients");
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        // Verify the structure of data
        if (!Array.isArray(data)) {
          console.error("Unexpected data structure:", data);
          return;
        }

        // Flatten all orders from the clients
        const allOrders = data.flatMap((client: any) =>
          client.orders
            ? client.orders.map((order: any) => ({
                id: order.id,
                item_name: order.item_name,
                status: order.status || "not_started", // Default to "not_started"
                date_needed: order.date_needed,
                date_of_event: order.date_of_event,
                total_cost: order.total_cost,
              }))
            : []
        );

        console.log("Parsed orders:", allOrders); // Debugging log

        setOrders(allOrders);
      } catch (error) {
        console.error("Failed to fetch clients with orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle drag and drop functionality
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedOrders = [...orders];
    const [movedOrder] = updatedOrders.splice(result.source.index, 1);
    movedOrder.status = result.destination.droppableId;
    updatedOrders.splice(result.destination.index, 0, movedOrder);

    setOrders(updatedOrders);
    // Optionally, update the order status in the backend if needed.
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className=" p-4 rounded-lg w-1/3 min-h-[200px]"
              >
                <h2 className="text-lg font-semibold mb-4 capitalize">
                  {column.replace("_", " ")}
                </h2>
                {orders
                  .filter((order) => order.status === column)
                  .sort(
                    (a, b) =>
                      new Date(a.date_needed).getTime() -
                      new Date(b.date_needed).getTime()
                  )
                  .map((order, index) => (
                    <Draggable
                      key={order.id}
                      draggableId={order.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <CardHeader>
                            <CardTitle>{order.item_name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>
                              Date Needed:{" "}
                              {new Date(order.date_needed).toLocaleDateString()}
                            </p>
                            <p>
                              Event Date:{" "}
                              {new Date(
                                order.date_of_event
                              ).toLocaleDateString()}
                            </p>
                            <p>Total Cost: ${order.total_cost}</p>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
