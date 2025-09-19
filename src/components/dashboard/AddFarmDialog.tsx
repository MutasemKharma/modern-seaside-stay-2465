import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddFarmDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (farm: any) => void;
  owners: any[];
}

export default function AddFarmDialog({ open, onClose, onAdd, owners }: AddFarmDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    base_price: 100,
    owner_id: "",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      location: "",
      description: "",
      base_price: 100,
      owner_id: "",
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Farm Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="owner">Assign Owner</Label>
            <Select value={formData.owner_id} onValueChange={(value) => setFormData({ ...formData, owner_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Base Price (JD)</Label>
            <Input
              id="price"
              type="number"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
              required
            />
          </div>
          <Button type="submit" className="w-full">Add Farm</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}