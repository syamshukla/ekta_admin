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
import { ChangeEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

// @ts-ignore
import type { Client } from "@/app/page";

type ClientListProps = {
  clients: Client[];
  onSelect: (client: Client) => void;
  selectedClient: Client | null;
  setIsNewOrderModalOpen: (open: boolean) => void;
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;
  newClient?: Partial<Omit<Client, "id">>;
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
  newClient = {},
  handleNewClientChange,
  handleNewClientSubmit,
}: ClientListProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold mb-4">Point of Contacts</h2>
          <Button
            variant="outline"
            onClick={() => setIsNewClientModalOpen(true)}
          >
            Add New POC
          </Button>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md ">
          {clients && clients.length > 0 ? (
            <ul className="space-y-2">
              {clients.map((client) => (
                <li key={client.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      selectedClient?.id === client.id
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => onSelect(client)}
                  >
                    <span className="truncate">
                      {client.name} - {client.location_of_event}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">
              No clients available
            </p>
          )}
        </ScrollArea>
      </CardContent>

      <Dialog
        open={isNewClientModalOpen}
        onOpenChange={setIsNewClientModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New POC</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClient?.name ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={newClient?.phone ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={newClient?.address ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDate" className="text-right">
                Event Date
              </Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={newClient?.eventDate ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shipmentDate" className="text-right">
                Shipment Date
              </Label>
              <Input
                id="shipmentDate"
                name="shipmentDate"
                type="date"
                value={newClient?.shipmentDate ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventLocation" className="text-right">
                Event Location
              </Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                value={newClient?.eventLocation ?? ""}
                onChange={handleNewClientChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleNewClientSubmit}>Add POC</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
