"use client";

import React, { useEffect, useState } from "react";
import ClientList from "@/components/client-list";
import { Button } from "@/components/ui/button";
import NewClientModal from "@/components/new-client-modal";
import NewOrderModal from "@/components/new-order-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface Client {
  name: string;
  client_id: string;
  phone_number: string;
  address: string;
  date_needed: string;
  date_of_event: string;
  location_of_event: string;
  orders: Order[];
}

interface Order {
  id: string; // Assuming this is an identifier
  client_name: string; // Client's name
  date_needed: string; // Date needed as a string
  date_of_event: string; // Date of the event as a string
  item_name: string; // Name of the item
  total_cost: string; // Total cost as a string
  items: Array<{
    fabric_source: string; // Source of the fabric
    fabric_meters: string; // Fabric meters as a string
    cost_per_meter: string; // Cost per meter as a string
    stitching_cost: string; // Stitching cost as a string
    embellishment_cost: string; // Embellishment cost as a string
    description: string; // Description of the item
  }>;

  tailor_name: string; // Tailor's name
  additional_embellishments: string; // In the JSON, this field may be represented as a string, e.g., "No"
}

interface ClientData {
  name: string;
  phone_number: string;
  address: string;
  date_needed: string;
  date_of_event: string;
  location_of_event: string;
}

const convertToUSD = (amountInINR: string, conversionRate: number = 82) => {
  const amount = parseFloat(amountInINR);
  return (amount / conversionRate).toFixed(2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function ClientManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/getClients");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        console.log("Fetched clients:", data);
        setClients(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch clients");
      }
    }

    fetchClients();
  }, [selectedClient, isNewClientModalOpen, isNewOrderModalOpen, deleteOrder]);

  const handleUpdate = async (orderId: string, updatedData: Partial<Order>) => {
    try {
      const response = await fetch(`/api/updateOrder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, ...updatedData }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Order updated successfully.");
        setSelectedClient((prevClient) => {
          if (!prevClient) return null;
          return {
            ...prevClient,
            orders: prevClient.orders.map((order) =>
              order.id === orderId ? { ...order, ...updatedData } : order
            ),
          };
        });
      } else {
        toast.error(`Failed to update order: ${result.error}`);
      }
    } catch (error) {
      toast.error("Failed to update order.");
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      const response = await fetch(`/api/deleteOrder/${orderId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Order deleted successfully.");
        setDeleteOrder((prev) => !prev);
        setSelectedClient((prevClient) => {
          if (!prevClient) return null;
          return {
            ...prevClient,
            orders: prevClient.orders.filter((order) => order.id !== orderId),
          };
        });
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  const handleNewClientSubmit = async (clientData: ClientData) => {
    try {
      const response = await fetch("/api/postClients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Failed to add new client: ${response.statusText}`);
      }

      const newClient = await response.json();
      setClients((prev) => [...prev, newClient]);
      setIsNewClientModalOpen(false);
      toast.success("New client added successfully.");
    } catch (error) {
      console.error("Error adding new client:", error);
      toast.error("Failed to add new client. Please try again.");
    }
  };

  const handleNewOrderSubmit = async (newOrderData: Partial<Order>) => {
    console.log("Submitting new order:", newOrderData); // Debug log

    try {
      const response = await fetch("/api/postOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error("Failed to add new order");
      }

      const addedOrder = await response.json();
      // Add the order to the client state
      setClients((prev) =>
        prev.map((client) =>
          client.client_id === selectedClient?.client_id
            ? {
                ...client,
                orders: [...(client.orders || []), addedOrder],
              }
            : client
        )
      );

      setSelectedClient((prevClient) => {
        if (!prevClient) return null;
        return {
          ...prevClient,
          orders: [...prevClient.orders, addedOrder],
        };
      });

      setIsNewOrderModalOpen(false);
      toast.success("New order added successfully.");
    } catch (error) {
      console.error("Failed to add new order:", error);
      toast.error("Failed to add new order. Please try again.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]  pt-16">
      <div className="w-1/3 p-4 border-r">
        <ClientList
          clients={clients}
          onSelect={setSelectedClient}
          selectedClient={selectedClient}
          setIsNewClientModalOpen={setIsNewClientModalOpen}
          setIsNewOrderModalOpen={function (open: boolean): void {
            throw new Error("Function not implemented.");
          }}
          isNewClientModalOpen={false}
          handleNewClientChange={function (
            event: React.ChangeEvent<HTMLInputElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          handleNewClientSubmit={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          {selectedClient && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-semibold">
                    Orders for {selectedClient.name}
                  </CardTitle>
                  <Button
                    onClick={() => setIsNewOrderModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <FaPlus /> Add New Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedClient.orders && selectedClient.orders.length > 0 ? (
                  <div className="space-y-4">
                    {selectedClient.orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>{order.item_name}</CardTitle>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="w-8 h-8 p-0 flex items-center justify-center"
                                onClick={() => handleUpdate(order.id, {})}
                              >
                                <FaEdit className="text-blue-500" />
                              </Button>
                              <Button
                                variant="outline"
                                className="w-8 h-8 p-0 flex items-center justify-center"
                                onClick={() => handleDelete(order.id)}
                              >
                                <FaTrash className="text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.client_name} | {order.id}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-3">
                            <OrderDetail
                              label="Total Cost"
                              value={`₹${order.total_cost} ($${convertToUSD(
                                order.total_cost
                              )})`}
                            />
                            <OrderDetail
                              label="Tailor Name"
                              value={order.tailor_name}
                            />
                            <OrderDetail
                              label="Date Needed"
                              value={formatDate(order.date_needed)}
                            />
                            <OrderDetail
                              label="Date Of Event"
                              value={formatDate(order.date_of_event)}
                            />
                          </div>

                          <Table className="w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Fabric Source</TableHead>
                                <TableHead>Fabric Meters</TableHead>
                                <TableHead>Cost per Meter</TableHead>
                                <TableHead>Stitching Cost</TableHead>
                                <TableHead>Embellishment Cost</TableHead>
                                <TableHead>Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.fabric_source}</TableCell>
                                  <TableCell>{item.fabric_meters}</TableCell>
                                  <TableCell>{item.cost_per_meter}</TableCell>
                                  <TableCell>{item.stitching_cost}</TableCell>
                                  <TableCell>
                                    {item.embellishment_cost}
                                  </TableCell>
                                  <TableCell>{item.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No orders for this client.</p>
                )}
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        //@ts-ignore
        onSubmit={handleNewClientSubmit}
      />
      {selectedClient && (
        <NewOrderModal
          isOpen={isNewOrderModalOpen}
          client_id={selectedClient.client_id}
          onClose={() => setIsNewOrderModalOpen(false)}
          onSubmit={handleNewOrderSubmit}
        />
      )}
    </div>
  );
}

const OrderDetail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

export default ClientManagementPage;
