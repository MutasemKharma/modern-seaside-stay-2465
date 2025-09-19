import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface FarmsListProps {
  farms: any[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function FarmsList({ farms, onDelete }: FarmsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Base Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {farms.map((farm) => (
          <TableRow key={farm.id}>
            <TableCell>{farm.name}</TableCell>
            <TableCell>{farm.location}</TableCell>
            <TableCell>{farm.profiles?.full_name || 'Unassigned'}</TableCell>
            <TableCell>JD {farm.base_price}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(farm.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}