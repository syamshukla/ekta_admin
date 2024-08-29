"use client";

import React, { useEffect, useState } from "react";
import ClientList from "@/components/client-list";
import { Button } from "@/components/ui/button";
import NewClientModal from "@/components/new-client-modal";
import NewOrderModal from "@/components/new-order-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Client {
  id: any;
  client_id: string;
  client_name: string;
  phone_number: string;
  address: string;
  date_needed: string;
  date_of_event: string;
  location_of_event: string;
  shipment_date: string;
  orders: Order[];
}

interface Order {
  name: string;
  id: string;
  date: string;
  item_name: string;
  total_cost: string;
  fabric_meters: number;
  cost_per_meter: string;
  stitching_cost: string;
  embellishment_cost: string;
  tailor_name: string;
  fabric_source: string;
  additional_embellishment: boolean;
  description: string;
}

interface ClientData {
  client_name: string;
  phone: string;
  address: string;
  shipmentDate: string;
  date_of_event: string;
  location_of_event: string;
}

const convertToUSD = (amountInINR: string, conversionRate: number = 82) => {
  const amount = parseFloat(amountInINR);
  return (amount / conversionRate).toFixed(2);
};

function ClientManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({});

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/getClients");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchClients();
  }, []);

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
    } catch (error) {
      console.error("Error adding new client:", error);
    }
  };

  const handleNewOrderSubmit = async (newOrderData: Partial<Order>) => {
    try {
      const response = await fetch("/api/postOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
      });

      if (!response.ok) {
        throw new Error("Failed to add new order");
      }

      const addedOrder = await response.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === selectedClient?.id
            ? {
                ...client,
                orders: [...(client.orders || []), addedOrder],
              }
            : client
        )
      );

      setIsNewOrderModalOpen(false);
    } catch (error) {
      console.error("Failed to add new order:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] pt-16">
      <div className="w-1/3 p-4 border-r">
        <ClientList
          clients={clients}
          onSelect={setSelectedClient}
          selectedClient={selectedClient}
          newClient={newClient}
          handleNewClientChange={(e) =>
            setNewClient((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          handleNewClientSubmit={() => {
            if (
              newClient.client_name &&
              newClient.phone_number &&
              newClient.address &&
              newClient.shipment_date &&
              newClient.date_of_event &&
              newClient.location_of_event
            ) {
              handleNewClientSubmit(newClient as ClientData);
            } else {
              console.error("Incomplete client data");
            }
          }}
          setIsNewClientModalOpen={setIsNewClientModalOpen}
          setIsNewOrderModalOpen={setIsNewOrderModalOpen}
          isNewClientModalOpen={isNewClientModalOpen}
        />
      </div>
      <div className="w-2/3 p-4">
        <ScrollArea className="h-full">
          {selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Orders for {selectedClient.client_name}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClient.orders && selectedClient.orders.length > 0 ? (
                  <div className="space-y-4">
                    {selectedClient.orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>{order.name}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {order.item_name} | {order.id}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <OrderDetail
                              label="Total Cost"
                              value={`₹${order.total_cost} ($${convertToUSD(
                                order.total_cost
                              )})`}
                            />
                            <OrderDetail
                              label="Fabric Meters"
                              value={order.fabric_meters.toString()}
                            />
                            <OrderDetail
                              label="Cost per Meter"
                              value={`₹${order.cost_per_meter} ($${convertToUSD(
                                order.cost_per_meter
                              )})`}
                            />
                            <OrderDetail
                              label="Stitching Cost"
                              value={`₹${order.stitching_cost} ($${convertToUSD(
                                order.stitching_cost
                              )})`}
                            />
                            <OrderDetail
                              label="Embellishment Cost"
                              value={`₹${
                                order.embellishment_cost
                              } ($${convertToUSD(order.embellishment_cost)})`}
                            />
                            <OrderDetail
                              label="Tailor"
                              value={order.tailor_name}
                            />
                            <OrderDetail
                              label="Fabric Source"
                              value={order.fabric_source}
                            />
                            {order.additional_embellishment && (
                              <OrderDetail
                                label="Additional Embellishment"
                                value="Yes"
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No orders available for this client.
                  </p>
                )}
                <Button
                  className="mt-4"
                  onClick={() => setIsNewOrderModalOpen(true)}
                >
                  Create New Order
                </Button>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        //@ts-ignore
        onSubmit={async (clientData: ClientData) => {
          return await handleNewClientSubmit(clientData);
        }}
      />

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSubmit={handleNewOrderSubmit}
        client_id={selectedClient?.client_id}
      />
    </div>
  );
}

function OrderDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}

export default ClientManagementPage;
