import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (updatedOrder: Partial<Order>) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  order,
  onClose,
  onSubmit,
}) => {
  const [updatedOrder, setUpdatedOrder] = useState<Partial<Order>>({
    ...order,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(updatedOrder);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            name="item_name"
            value={updatedOrder.item_name || ""}
            onChange={handleChange}
            placeholder="Item Name"
            className="input"
          />
          <input
            type="text"
            name="total_cost"
            value={updatedOrder.total_cost || ""}
            onChange={handleChange}
            placeholder="Total Cost"
            className="input"
          />
          <input
            type="number"
            name="fabric_meters"
            value={updatedOrder.fabric_meters || ""}
            onChange={handleChange}
            placeholder="Fabric Meters"
            className="input"
          />
          <input
            type="text"
            name="cost_per_meter"
            value={updatedOrder.cost_per_meter || ""}
            onChange={handleChange}
            placeholder="Cost per Meter"
            className="input"
          />
          <input
            type="text"
            name="stitching_cost"
            value={updatedOrder.stitching_cost || ""}
            onChange={handleChange}
            placeholder="Stitching Cost"
            className="input"
          />
          <input
            type="text"
            name="embellishment_cost"
            value={updatedOrder.embellishment_cost || ""}
            onChange={handleChange}
            placeholder="Embellishment Cost"
            className="input"
          />
          <input
            type="text"
            name="tailor_name"
            value={updatedOrder.tailor_name || ""}
            onChange={handleChange}
            placeholder="Tailor Name"
            className="input"
          />
          <input
            type="text"
            name="fabric_source"
            value={updatedOrder.fabric_source || ""}
            onChange={handleChange}
            placeholder="Fabric Source"
            className="input"
          />
          <textarea
            name="description"
            value={updatedOrder.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="textarea"
          />
        </div>
        <Button onClick={handleSubmit} variant="outline" className="mt-4">
          Save Changes
        </Button>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
