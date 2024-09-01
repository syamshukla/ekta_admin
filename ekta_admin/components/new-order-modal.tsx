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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ItemModal from "./item-modal";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
  client_id: string | undefined;
}

interface Item {
  id?: string;
  fabric_source: string;
  fabric_meters: number;
  cost_per_meter: number;
  stitching_cost: number;
  embellishment_cost: number;
  description: string;
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
    date_needed: "",
    date_of_event: "",
    item_name: "",
    tailor_name: "",
    status: "Pending",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    if (client_id) {
      setNewOrder((prev) => ({ ...prev, client_id }));
    }
  }, [client_id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewOrder((prev) => ({ ...prev, tailor_name: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !newOrder.client_name ||
      !newOrder.date_needed ||
      !newOrder.date_of_event ||
      !newOrder.item_name ||
      items.length === 0
    ) {
      alert("Please fill out all required fields and add at least one item.");
      return;
    }

    const totalCost = items.reduce((sum, item) => {
      return (
        sum +
        (item.fabric_meters * item.cost_per_meter +
          item.stitching_cost +
          item.embellishment_cost)
      );
    }, 0);

    onSubmit({ ...newOrder, items, total_cost: totalCost });
    setNewOrder({
      client_name: "",
      client_id: "",
      date_needed: "",
      date_of_event: "",
      item_name: "",
      tailor_name: "",
      status: "Pending",
    });
    setItems([]);
  };

  const handleAddItem = (item: Item) => {
    setItems((prev) => [...prev, item]);
    setIsItemModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
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
              <Label htmlFor="date_needed" className="text-right">
                Date Needed
              </Label>
              <Input
                id="date_needed"
                name="date_needed"
                type="date"
                value={newOrder.date_needed}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_of_event" className="text-right">
                Date of Event
              </Label>
              <Input
                id="date_of_event"
                name="date_of_event"
                type="date"
                value={newOrder.date_of_event}
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
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <Table>
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
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fabric_source}</TableCell>
                    <TableCell>{item.fabric_meters}</TableCell>
                    <TableCell>{item.cost_per_meter}</TableCell>
                    <TableCell>{item.stitching_cost}</TableCell>
                    <TableCell>{item.embellishment_cost}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              onClick={() => setIsItemModalOpen(true)}
              className="mt-4"
            >
              Add Item
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </Dialog>
  );
};

export default NewOrderModal;
