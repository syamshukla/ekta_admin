"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: ClientData) => void;
}

interface ClientData {
  name: string;
  phone_number: string;
  address: string;
  location_of_event: string;
}

const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [newClient, setNewClient] = useState<ClientData>({
    name: "",
    phone_number: "",
    address: "",
    location_of_event: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(newClient);
    setNewClient({
      name: "",
      phone_number: "",
      address: "",
      location_of_event: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={newClient.phone_number}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={newClient.address}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location_of_event" className="text-right">
                Event Location
              </Label>
              <Input
                id="location_of_event"
                name="location_of_event"
                value={newClient.location_of_event}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientModal;
