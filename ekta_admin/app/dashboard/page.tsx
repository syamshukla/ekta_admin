"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ClientList from "@/components/client-list";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Order = {
  id: string;
  clientName: string;
  garmentTitle: string;
  tailorName: string;
  fabricSource: string;
  fabricMeters: number;
  fabricCostPerMeter: number;
  fabricCost: {
    inr: number;
    usd: number;
  };
  stitchingCost: {
    inr: number;
    usd: number;
  };
  padded: boolean;
  kanKan: boolean;
  embellishments: string;
};

type Client = {
  id: string;
  name: string;
  phone: string;
  address: string;
  eventDate: string;
  shipmentDate: string;
  eventLocation: string;
  orders: Order[];
};

export default function Page() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] =
    useState<boolean>(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] =
    useState<boolean>(false);

  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    phone: "",
    address: "",
    eventDate: "",
    shipmentDate: "",
    eventLocation: "",
    orders: [],
  });

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    clientName: "",
    garmentTitle: "",
    tailorName: "",
    fabricSource: "",
    fabricMeters: 0,
    fabricCostPerMeter: 0,
    fabricCost: {
      inr: 0,
      usd: 0,
    },
    stitchingCost: {
      inr: 0,
      usd: 0,
    },
    padded: false,
    kanKan: false,
    embellishments: "",
  });

  // Fetch clients on component mount
  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/get-clients");
        const data = await response.json();
        if (response.ok) {
          console.log("Clients:", clients);
          setClients(data.clients); // Ensure `data.clients` is an array
        } else {
          console.error("Error fetching clients:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchClients();
  }, []);

  function handleClientSelect(client: Client) {
    setSelectedClient(client);
  }

  function handleNewClientChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  }

  function handleNewClientSubmit() {
    if (Object.values(newClient).some((value) => !value)) {
      alert("Please fill in all client fields.");
      return;
    }
    setClients((prev) => [...prev, { id: `${Date.now()}`, ...newClient }]);
    setNewClient({
      name: "",
      phone: "",
      address: "",
      eventDate: "",
      shipmentDate: "",
      eventLocation: "",
      orders: [],
    });
    setIsNewClientModalOpen(false);
  }

  function handleNewOrderChange(
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value, type, checked } = event.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleNewOrderSubmit() {
    if (!selectedClient) {
      alert("No client selected.");
      return;
    }
    setSelectedClient((prev) => {
      if (!prev) return null;
      const updatedOrders = [
        ...prev.orders,
        { id: `${Date.now()}`, ...newOrder },
      ];
      return { ...prev, orders: updatedOrders };
    });
    setNewOrder({
      clientName: "",
      garmentTitle: "",
      tailorName: "",
      fabricSource: "",
      fabricMeters: 0,
      fabricCostPerMeter: 0,
      fabricCost: {
        inr: 0,
        usd: 0,
      },
      stitchingCost: {
        inr: 0,
        usd: 0,
      },
      padded: false,
      kanKan: false,
      embellishments: "",
    });
    setIsNewOrderModalOpen(false);
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="border-r bg-background p-6 w-80">
        <ClientList
          clients={clients}
          onSelect={handleClientSelect}
          selectedClient={selectedClient}
          setIsNewOrderModalOpen={setIsNewOrderModalOpen}
          isNewClientModalOpen={isNewClientModalOpen}
          setIsNewClientModalOpen={setIsNewClientModalOpen}
          newClient={newClient}
          handleNewClientChange={handleNewClientChange}
          handleNewClientSubmit={handleNewClientSubmit}
        />
      </aside>
      {selectedClient && (
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedClient.name} - {selectedClient.eventLocation}
            </h2>
            <Button
              variant="outline"
              onClick={() => setIsNewOrderModalOpen(true)}
            >
              Add New Order
            </Button>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold">Contact</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{selectedClient.phone}</p>
                  <p>{selectedClient.address}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Event</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Date: {selectedClient.eventDate}</p>
                  <p>Shipment: {selectedClient.shipmentDate}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Orders</h3>
              <div className="grid gap-4">
                {selectedClient.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-md bg-background p-4 shadow-sm"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Client Name
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.clientName}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold">Fabric</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>Source: {order.fabricSource}</p>
                          <p>Meters: {order.fabricMeters}</p>
                          <p>
                            Cost per Meter: ₹{order.fabricCostPerMeter} ($
                            {(order.fabricCostPerMeter / 80).toFixed(2)})
                          </p>
                          <p>
                            Total Fabric Cost: ₹{order.fabricCost.inr} ($
                            {order.fabricCost.usd})
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Stitching
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Stitching Cost: ₹{order.stitchingCost.inr} ($
                            {order.stitchingCost.usd})
                          </p>
                          <p>Padded: {order.padded ? "Yes" : "No"}</p>
                          <p>KanKan: {order.kanKan ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="mb-2 text-sm font-semibold">
                        Embellishments
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {order.embellishments}
                      </p>
                      <h4 className="mt-2 mb-2 text-sm font-semibold">
                        Garment
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {order.garmentTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={isNewClientModalOpen}
        onOpenChange={setIsNewClientModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="name"
                placeholder="Client Name"
                value={newClient.name}
                onChange={handleNewClientChange}
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newClient.phone}
                onChange={handleNewClientChange}
              />
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={newClient.address}
                onChange={handleNewClientChange}
              />
              <Input
                type="date"
                name="eventDate"
                placeholder="Event Date"
                value={newClient.eventDate}
                onChange={handleNewClientChange}
              />
              <Input
                type="date"
                name="shipmentDate"
                placeholder="Shipment Date"
                value={newClient.shipmentDate}
                onChange={handleNewClientChange}
              />
              <Input
                type="text"
                name="eventLocation"
                placeholder="Event Location"
                value={newClient.eventLocation}
                onChange={handleNewClientChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="submit" onClick={handleNewClientSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                name="clientName"
                value={newOrder.clientName}
                onValueChange={(value) =>
                  setNewOrder((prev) => ({ ...prev, clientName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                name="garmentTitle"
                placeholder="Garment Title"
                value={newOrder.garmentTitle}
                onChange={handleNewOrderChange}
              />
              <Input
                type="text"
                name="tailorName"
                placeholder="Tailor Name"
                value={newOrder.tailorName}
                onChange={handleNewOrderChange}
              />
              <Input
                type="text"
                name="fabricSource"
                placeholder="Fabric Source"
                value={newOrder.fabricSource}
                onChange={handleNewOrderChange}
              />
              <Input
                type="number"
                name="fabricMeters"
                placeholder="Fabric Meters"
                value={newOrder.fabricMeters}
                onChange={handleNewOrderChange}
              />
              <Input
                type="number"
                name="fabricCostPerMeter"
                placeholder="Fabric Cost per Meter"
                value={newOrder.fabricCostPerMeter}
                onChange={handleNewOrderChange}
              />
              <Input
                type="number"
                name="stitchingCostInr"
                placeholder="Stitching Cost (INR)"
                value={newOrder.stitchingCost.inr}
                onChange={handleNewOrderChange}
              />
              <Input
                type="number"
                name="stitchingCostUsd"
                placeholder="Stitching Cost (USD)"
                value={newOrder.stitchingCost.usd}
                onChange={handleNewOrderChange}
              />
              <Switch
                id="padded"
                name="padded"
                checked={newOrder.padded}
                onCheckedChange={(checked) =>
                  setNewOrder((prev) => ({ ...prev, padded: checked }))
                }
              />
              <Switch
                id="kanKan"
                name="kanKan"
                checked={newOrder.kanKan}
                onCheckedChange={(checked) =>
                  setNewOrder((prev) => ({ ...prev, kanKan: checked }))
                }
              />
              <Textarea
                name="embellishments"
                placeholder="Embellishments"
                value={newOrder.embellishments}
                onChange={handleNewOrderChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="submit" onClick={handleNewOrderSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
