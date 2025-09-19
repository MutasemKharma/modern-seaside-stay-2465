import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingManagerProps {
  farm: any;
  onUpdate: (updates: any) => void;
}

export default function PricingManager({ farm, onUpdate }: PricingManagerProps) {
  const [basePrice, setBasePrice] = useState(farm.base_price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ base_price: basePrice });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="basePrice">Base Price (JD per night)</Label>
        <Input
          id="basePrice"
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          min={0}
          step={0.01}
        />
      </div>
      <Button type="submit">Update Price</Button>
    </form>
  );
}