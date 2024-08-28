import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Client } from "@/app/page";

type ClientListProps = {
  clients: Client[];
  onSelect: (client: Client) => void;
  selectedClient: Client | null;
  setIsNewOrderModalOpen: (open: boolean) => void;
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;
  newClient: Omit<Client, "id">;
  handleNewClientChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleNewClientSubmit: () => void;
};

export default function ClientList({
  clients,
  onSelect,
  selectedClient,
  setIsNewOrderModalOpen,
  isNewClientModalOpen,
  setIsNewClientModalOpen,
  newClient,
  handleNewClientChange,
  handleNewClientSubmit,
}: ClientListProps) {
  return (
    <div>
      <div className="mb-4 p-3 flex justify-center flex-col items-center">
        <h2 className="text-lg font-semibold">Point of Contacts</h2>
        <Button variant="outline" onClick={() => setIsNewClientModalOpen(true)}>
          Add New POC
        </Button>
      </div>
      <ul className="space-y-2">
        {clients && clients.length > 0 ? (
          clients.map((client) => (
            <li
              key={client.id}
              className={`p-4 rounded-md cursor-pointer ${
                selectedClient?.id === client.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
              onClick={() => onSelect(client)}
            >
              {client.name} - {client.eventLocation}
            </li>
          ))
        ) : (
          <li className="p-4 rounded-md">No clients available</li>
        )}
      </ul>

      {/* Dialog for adding a new client */}
      <Dialog
        open={isNewClientModalOpen}
        onOpenChange={(open) => setIsNewClientModalOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New POC</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleNewClientChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={newClient.phone}
                onChange={handleNewClientChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={newClient.address}
                onChange={handleNewClientChange}
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={newClient.eventDate}
                onChange={handleNewClientChange}
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
              />
            </div>
            <div>
              <Label htmlFor="eventLocation">Event Location</Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                value={newClient.eventLocation}
                onChange={handleNewClientChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleNewClientSubmit}>Add POC</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
