"use client";
//@ts-nocheck
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      phone: "+91 9876543210",
      address: "123 Main St, New Delhi, India",
      eventDate: "2023-06-15",
      shipmentDate: "2023-06-10",
      eventLocation: "New Delhi",
      orders: [
        {
          id: 1,
          padded: true,
          kanKan: false,
          fabricSource: "Silk",
          fabricMeters: 5.2,
          fabricCostPerMeter: 500,
          fabricCost: {
            inr: 2600,
            usd: 32.5,
          },
          stitchingCost: {
            inr: 800,
            usd: 10,
          },
          embellishments: "Sequin detailing",
        },
        {
          id: 2,
          padded: false,
          kanKan: true,
          fabricSource: "Cotton",
          fabricMeters: 3.8,
          fabricCostPerMeter: 200,
          fabricCost: {
            inr: 760,
            usd: 9.5,
          },
          stitchingCost: {
            inr: 500,
            usd: 6.25,
          },
          embellishments: "Lace trim",
        },
      ],
    },
    {
      id: 2,
      name: "Aisha Khan",
      phone: "+91 8765432109",
      address: "456 Park Ave, Mumbai, India",
      eventDate: "2023-07-01",
      shipmentDate: "2023-06-25",
      eventLocation: "Mumbai",
      orders: [
        {
          id: 1,
          padded: true,
          kanKan: true,
          fabricSource: "Velvet",
          fabricMeters: 4.5,
          fabricCostPerMeter: 800,
          fabricCost: {
            inr: 3600,
            usd: 45,
          },
          stitchingCost: {
            inr: 1000,
            usd: 12.5,
          },
          embellishments: "Rhinestone accents",
        },
      ],
    },
    {
      id: 3,
      name: "Rohan Gupta",
      phone: "+91 7654321098",
      address: "789 Oak St, Bangalore, India",
      eventDate: "2023-08-01",
      shipmentDate: "2023-07-20",
      eventLocation: "Bangalore",
      orders: [
        {
          id: 1,
          padded: false,
          kanKan: false,
          fabricSource: "Chiffon",
          fabricMeters: 6.1,
          fabricCostPerMeter: 300,
          fabricCost: {
            inr: 1830,
            usd: 22.88,
          },
          stitchingCost: {
            inr: 700,
            usd: 8.75,
          },
          embellishments: "Beaded neckline",
        },
        {
          id: 2,
          padded: true,
          kanKan: true,
          fabricSource: "Satin",
          fabricMeters: 4.8,
          fabricCostPerMeter: 400,
          fabricCost: {
            inr: 1920,
            usd: 24,
          },
          stitchingCost: {
            inr: 900,
            usd: 11.25,
          },
          embellishments: "Floral appliques",
        },
      ],
    },
  ]);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    address: "",
    eventDate: "",
    shipmentDate: "",
    eventLocation: "",
    orders: [],
  });
  const [newOrder, setNewOrder] = useState({
    padded: false,
    kanKan: false,
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
    embellishments: "",
  });
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const handleClientSelect = (client: SetStateAction<null>) => {
    setSelectedClient(client);
  };
  const handleNewClientChange = (e: { target: { name: any; value: any } }) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };
  const handleNewOrderChange = (e: { target: { name: any; value: any } }) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };
  const handleNewClientSubmit = () => {
    setClients([...clients, { ...newClient, id: clients.length + 1 }]);
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
  };
  const handleNewOrderSubmit = () => {
    setSelectedClient({
      // @ts-ignore
      ...selectedClient,
      orders: [
        // @ts-ignore
        ...selectedClient.orders,
        // @ts-ignore
        { ...newOrder, id: selectedClient.orders.length + 1 },
      ],
    });
    setNewOrder({
      padded: false,
      kanKan: false,
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
      embellishments: "",
    });
    setIsNewOrderModalOpen(false);
  };
  const [costInputMethod, setCostInputMethod] = useState("auto");

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="border-r bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold">Clients</h2>
        <ul className="grid gap-2">
          {clients.map((client) => (
            <li
              key={client.id}
              className={`cursor-pointer rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                // @ts-ignore
                selectedClient?.id === client.id
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
              // @ts-ignore
              onClick={() => handleClientSelect(client)}
            >
              {client.name}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">Add New Client</h2>
          <Button
            variant="outline"
            onClick={() => setIsNewClientModalOpen(true)}
            className="w-full"
          >
            Add New Client
          </Button>
          {isNewClientModalOpen && (
            <Dialog
              open={isNewClientModalOpen}
              onOpenChange={setIsNewClientModalOpen}
            >
              <DialogContent className="p-6 max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Please fill in the client details.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewClientSubmit} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newClient.name}
                        onChange={handleNewClientChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newClient.phone}
                        onChange={handleNewClientChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={newClient.address}
                      onChange={handleNewClientChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={newClient.eventDate}
                        onChange={handleNewClientChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipmentDate">Shipment Date</Label>
                      <Input
                        id="shipmentDate"
                        name="shipmentDate"
                        type="date"
                        value={newClient.shipmentDate}
                        onChange={handleNewClientChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventLocation">Event Location</Label>
                    <Input
                      id="eventLocation"
                      name="eventLocation"
                      value={newClient.eventLocation}
                      onChange={handleNewClientChange}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Client</Button>
                    <div>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </aside>
      {selectedClient && (
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {/* @ts-ignore */}
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
                  {/* @ts-ignore */}
                  <p>{selectedClient.phone}</p>
                  {/* @ts-ignore */}
                  <p>{selectedClient.address}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Event</h3>
                <div className="text-sm text-muted-foreground">
                  {/* @ts-ignore */}
                  <p>Date: {selectedClient.eventDate}</p>
                  {/* @ts-ignore */}
                  <p>Shipment: {selectedClient.shipmentDate}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Orders</h3>
              <div className="grid gap-4">
                {/* @ts-ignore */}
                {selectedClient.orders.map(
                  (order: {
                    id: Key | null | undefined;
                    fabricSource:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    fabricMeters:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    fabricCostPerMeter:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    fabricCost: {
                      inr:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                      usd:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                    };
                    stitchingCost: {
                      inr:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                      usd:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                    };
                    padded: any;
                    kanKan: any;
                    embellishments:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                  }) => (
                    <div
                      key={order.id}
                      className="rounded-md bg-background p-4 shadow-sm"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold">Fabric</h4>
                          <div className="text-sm text-muted-foreground">
                            <p>Source: {order.fabricSource}</p>
                            <p>Meters: {order.fabricMeters}</p>
                            <p>
                              Cost per Meter: ₹{order.fabricCostPerMeter} (${" "}
                              {/* @ts-ignore */}
                              {(order.fabricCostPerMeter / 80).toFixed(2)})
                            </p>
                            <p>
                              Total Fabric Cost: ₹{order.fabricCost.inr} (${" "}
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
                              Stitching Cost: ₹{order.stitchingCost.inr} (${" "}
                              {order.stitchingCost.usd})
                            </p>
                            <p>Padded: {order.padded ? "Yes" : "No"}</p>
                            <p>Kan Kan: {order.kanKan ? "Yes" : "No"}</p>
                            <p>Embellishments: {order.embellishments}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {isNewOrderModalOpen && (
            <Dialog
              open={isNewOrderModalOpen}
              onOpenChange={setIsNewOrderModalOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Order</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new order.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewOrderSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fabricSource" className="text-right">
                        Fabric Source
                      </Label>
                      <Input
                        id="fabricSource"
                        name="fabricSource"
                        value={newOrder.fabricSource}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fabricMeters" className="text-right">
                        Fabric Meters
                      </Label>
                      <Input
                        id="fabricMeters"
                        name="fabricMeters"
                        type="number"
                        value={newOrder.fabricMeters}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="fabricCostPerMeter"
                        className="text-right"
                      >
                        Cost per Meter (INR)
                      </Label>
                      <Input
                        id="fabricCostPerMeter"
                        name="fabricCostPerMeter"
                        type="number"
                        value={newOrder.fabricCostPerMeter}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <RadioGroup
                      defaultValue="auto"
                      onValueChange={(value) => setCostInputMethod(value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto">Auto-calculate fabric cost</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">
                          Manually input fabric cost
                        </Label>
                      </div>
                    </RadioGroup>
                    {costInputMethod === "manual" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="fabricCost.inr"
                            className="text-right"
                          >
                            Fabric Cost (INR)
                          </Label>
                          <Input
                            id="fabricCost.inr"
                            name="fabricCost.inr"
                            type="number"
                            value={newOrder.fabricCost.inr}
                            onChange={handleNewOrderChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="fabricCost.usd"
                            className="text-right"
                          >
                            Fabric Cost (USD)
                          </Label>
                          <Input
                            id="fabricCost.usd"
                            name="fabricCost.usd"
                            type="number"
                            value={newOrder.fabricCost.usd}
                            onChange={handleNewOrderChange}
                            className="col-span-3"
                          />
                        </div>
                      </>
                    )}
                    {costInputMethod === "auto" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Fabric Cost</Label>
                        <div className="col-span-3">
                          <p>INR: {newOrder.fabricCost.inr.toFixed(2)}</p>
                          <p>USD: {newOrder.fabricCost.usd}</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stitchingCost.inr" className="text-right">
                        Stitching Cost (INR)
                      </Label>
                      <Input
                        id="stitchingCost.inr"
                        name="stitchingCost.inr"
                        type="number"
                        value={newOrder.stitchingCost.inr}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stitchingCost.usd" className="text-right">
                        Stitching Cost (USD)
                      </Label>
                      <Input
                        id="stitchingCost.usd"
                        name="stitchingCost.usd"
                        type="number"
                        value={newOrder.stitchingCost.usd}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="embellishments" className="text-right">
                        Embellishments
                      </Label>
                      <Input
                        id="embellishments"
                        name="embellishments"
                        value={newOrder.embellishments}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        // @ts-ignore
                        value={newOrder.description}
                        onChange={handleNewOrderChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="padded"
                        name="padded"
                        checked={newOrder.padded}
                        onCheckedChange={(checked) =>
                          setNewOrder((prevOrder) => ({
                            ...prevOrder,
                            padded: checked,
                          }))
                        }
                      />
                      <Label htmlFor="padded">Padded</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="kanKan"
                        name="kanKan"
                        checked={newOrder.kanKan}
                        onCheckedChange={(checked) =>
                          setNewOrder((prevOrder) => ({
                            ...prevOrder,
                            kanKan: checked,
                          }))
                        }
                      />
                      <Label htmlFor="kanKan">Kan Kan</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Order</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
