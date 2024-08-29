"use client";

import React, { useEffect, useState } from "react";
import ClientList from "@/components/client-list";
import { Button } from "@/components/ui/button";
import NewClientModal from "@/components/new-client-modal";
import NewOrderModal from "@/components/new-order-modal";

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
  total_cost: string; // INR as string
  fabric_meters: number;
  cost_per_meter: string; // INR as string
  stitching_cost: string; // INR as string
  embellishment_cost: string; // INR as string
  tailor_name: string;
  fabric_source: string;
  additional_embellishment: boolean;
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

  // Fetch clients from the API when the component mounts
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
      setClients((prev) => [...prev, newClient]); // Update with new client
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
      <div className="w-full p-4 overflow-y-auto">
        {selectedClient && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Orders for {selectedClient.client_name}
            </h2>
            {selectedClient.orders && selectedClient.orders.length > 0 ? (
              <div className="flex flex-col m-1 w-full">
                {selectedClient.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-card border-2 w-2/3 rounded-lg m-2 shadow-lg overflow-hidden p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-medium">{order.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {order.item_name}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {order.date}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="text-lg font-medium">
                          ₹{order.total_cost} (${convertToUSD(order.total_cost)}
                          )
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fabric Meters</p>
                        <p className="text-lg font-medium">
                          {order.fabric_meters}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per Meter</p>
                        <p className="text-lg font-medium">
                          ₹{order.cost_per_meter} ($
                          {convertToUSD(order.cost_per_meter)})
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stitching Cost</p>
                        <p className="text-lg font-medium">
                          ₹{order.stitching_cost} ($
                          {convertToUSD(order.stitching_cost)})
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-muted-foreground">
                          Embellishment Cost
                        </p>
                        <p className="text-lg font-medium">
                          ₹{order.embellishment_cost} ($
                          {convertToUSD(order.embellishment_cost)})
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tailor</p>
                        <p className="text-lg font-medium">
                          {order.tailor_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fabric Source</p>
                        <p className="text-lg font-medium">
                          {order.fabric_source}
                        </p>
                      </div>
                      {order.additional_embellishment && (
                        <div>
                          <p className="text-muted-foreground">
                            Additional Embellishment
                          </p>
                          <p className="text-lg font-medium">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No orders available for this client.
              </p>
            )}
            <Button
              className="mt-6"
              onClick={() => setIsNewOrderModalOpen(true)}
            >
              Create New Order
            </Button>
          </div>
        )}
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        //@ts-ignore
        onSubmit={async (clientData: ClientData) => {
          await handleNewClientSubmit(clientData);
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

export default ClientManagementPage;
