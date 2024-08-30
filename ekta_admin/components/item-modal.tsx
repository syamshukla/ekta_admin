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

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Item) => void;
}

interface Item {
  fabric_source: string;
  fabric_meters: number;
  cost_per_meter: number;
  stitching_cost: number;
  embellishment_cost: number;
  description: string;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [item, setItem] = useState<Item>({
    fabric_source: "",
    fabric_meters: 0,
    cost_per_meter: 0,
    stitching_cost: 0,
    embellishment_cost: 0,
    description: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItem((prev) => ({ ...prev, [name]: name.includes("cost") || name === "fabric_meters" ? parseFloat(value) : value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(item);
    setItem({
      fabric_source: "",
      fabric_meters: 0,
      cost_per_meter: 0,
      stitching_cost: 0,
      embellishment_cost: 0,
      description: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fabric_source" className="text-right">
                Fabric Source
              </Label>
              <Input
                id="fabric_source"
                name="fabric_source"
                value={item.fabric_source}
                onChange={handleChange}
                className="col-span-3"
                required
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
                value={item.fabric_meters}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost_per_meter" className="text-right">
                Cost per Meter
              </Label>
              <Input
                id="cost_per_meter"
                name="cost_per_meter"
                type="number"
                value={item.cost_per_meter}
                onChange={handleChange}
                className="col-span-3"
                required
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
                value={item.stitching_cost}
                onChange={handleChange}
                className="col-span-3"
                required
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
                value={item.embellishment_cost}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={item.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;