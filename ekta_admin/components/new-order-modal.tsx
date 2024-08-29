import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
  client_id: string | undefined;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client_id,
}) => {
  const [newOrder, setNewOrder] = useState({
    client_name: "",
    client_id: "",
    date: "",
    description: "",
    item_name: "",
    fabric_source: "",
    fabric_meters: "",
    cost_per_meter: "",
    stitching_cost: "",
    embellishment_cost: "",
    tailor_name: "",
    additional_embellishment: false,
  });

  useEffect(() => {
    if (client_id) {
      setNewOrder((prev) => ({ ...prev, client_id }));
    }
  }, [client_id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    setNewOrder((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setNewOrder((prev) => ({
      ...prev,
      tailor_name: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    if (!newOrder.client_name || !newOrder.date || !newOrder.item_name) {
      alert("Please fill out all required fields.");
      return;
    }

    onSubmit(newOrder);
    setNewOrder({
      client_name: "",
      client_id: "",
      date: "",
      description: "",
      item_name: "",
      fabric_source: "",
      fabric_meters: "",
      cost_per_meter: "",
      stitching_cost: "",
      embellishment_cost: "",
      tailor_name: "",
      additional_embellishment: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client_name" className="text-right">
                Client Name
              </Label>
              <Input
                id="client_name"
                name="client_name"
                value={newOrder.client_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tailor_name" className="text-right">
                Tailor Name
              </Label>
              <Select
                value={newOrder.tailor_name}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  {newOrder.tailor_name || "Select Tailor"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nehal Ben">Nehal Ben</SelectItem>
                  <SelectItem value="Pooja Ben">Pooja Ben</SelectItem>
                  <SelectItem value="Ravi Bhai">Ravi Bhai</SelectItem>
                  <SelectItem value="Upasana">Upasana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newOrder.date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item_name" className="text-right">
                Item Name
              </Label>
              <Input
                id="item_name"
                name="item_name"
                value={newOrder.item_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fabric_source" className="text-right">
                Fabric Source
              </Label>
              <Input
                id="fabric_source"
                name="fabric_source"
                value={newOrder.fabric_source}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fabric_meters" className="text-right">
                Fabric Meters
              </Label>
              <Input
                id="fabric_meters"
                name="fabric_meters"
                type="number"
                value={newOrder.fabric_meters}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost_per_meter" className="text-right">
                Cost Per Meter
              </Label>
              <Input
                id="cost_per_meter"
                name="cost_per_meter"
                type="number"
                value={newOrder.cost_per_meter}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stitching_cost" className="text-right">
                Stitching Cost
              </Label>
              <Input
                id="stitching_cost"
                name="stitching_cost"
                type="number"
                value={newOrder.stitching_cost}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="embellishment_cost" className="text-right">
                Embellishment Cost
              </Label>
              <Input
                id="embellishment_cost"
                name="embellishment_cost"
                type="number"
                value={newOrder.embellishment_cost}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additional_embellishment" className="text-right">
                Additional Embellishment
              </Label>
              <Checkbox
                id="additional_embellishment"
                name="additional_embellishment"
                checked={newOrder.additional_embellishment}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: {
                      name: "additional_embellishment",
                      type: "checkbox",
                      checked: checked,
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={newOrder.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderModal;
function onDelete(orderId: any) {
  throw new Error("Function not implemented.");
}
