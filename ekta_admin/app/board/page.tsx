// pages/board.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KanbanOrder {
  id: string;
  client_name: string;
  item_name: string;
  status: string;
  date_needed: string;
  date_of_event: string;
  total_cost: string;
}

const Board: React.FC = () => {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/getClients");
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        // Flatten all orders from the clients
        const allOrders = data.flatMap((client: any) =>
          client.orders
            ? client.orders.map((order: any) => ({
                id: order.id,
                item_name: order.item_name,
                client_name: order.client_name,
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

  // Helper function to check if the date is within a week
  const isDateNeededSoon = (dateNeeded: string) => {
    const date = new Date(dateNeeded);
    const today = new Date();
    const diffInDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays <= 7 && diffInDays >= 0; // Within a week from today
  };

  // Function to sort orders by date_needed in descending order (most recent first)
  const sortByDateNeeded = (orders: KanbanOrder[]) => {
    return orders.sort(
      (a, b) =>
        new Date(b.date_needed).getTime() - new Date(a.date_needed).getTime()
    );
  };

  // Group and sort orders by status
  const ordersByStatus = {
    not_started: sortByDateNeeded(
      orders.filter((order) => order.status === "not_started")
    ),
    in_progress: sortByDateNeeded(
      orders.filter((order) => order.status === "in_progress")
    ),
    completed: sortByDateNeeded(
      orders.filter((order) => order.status === "completed")
    ),
  };

  return (
    <div className="p-4 grid grid-cols-1 justify-center  w-full md:grid-cols-3 gap-4">
      {/* Column for Not Started */}
      <div>
        <h2 className="font-bold text-lg text-center items-left mb-2">
          Not Started
        </h2>
        {ordersByStatus.not_started.map((order) => (
          <Card
            key={order.id}
            className={`shadow-md rounded-lg  mb-4 ${
              isDateNeededSoon(order.date_needed)
                ? "border-red-500 border-2"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{order.item_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Client Name: {order.client_name}</p>
              <p>
                Date Needed: {new Date(order.date_needed).toLocaleDateString()}
              </p>
              <p>
                Event Date: {new Date(order.date_of_event).toLocaleDateString()}
              </p>
              <p>Total Cost: ${order.total_cost}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Column for In Progress */}
      <div>
        <h2 className="font-bold text-center text-lg mb-2">In Progress</h2>
        {ordersByStatus.in_progress.map((order) => (
          <Card
            key={order.id}
            className={`shadow-md rounded-lg p-4 mb-4 ${
              isDateNeededSoon(order.date_needed)
                ? "border-red-500 border-2"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{order.item_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Date Needed: {new Date(order.date_needed).toLocaleDateString()}
              </p>
              <p>
                Event Date: {new Date(order.date_of_event).toLocaleDateString()}
              </p>
              <p>Total Cost: ${order.total_cost}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Column for Completed */}
      <div>
        <h2 className="font-bold text-lg text-center mb-2">Completed</h2>
        {ordersByStatus.completed.map((order) => (
          <Card
            key={order.id}
            className={`shadow-md rounded-lg p-4 mb-4 ${
              isDateNeededSoon(order.date_needed)
                ? "border-red-500 border-2"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{order.item_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Date Needed: {new Date(order.date_needed).toLocaleDateString()}
              </p>
              <p>
                Event Date: {new Date(order.date_of_event).toLocaleDateString()}
              </p>
              <p>Total Cost: ${order.total_cost}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Board;
