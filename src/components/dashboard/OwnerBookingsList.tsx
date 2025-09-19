import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OwnerBookingsListProps {
  bookings: any[];
}

export default function OwnerBookingsList({ bookings }: OwnerBookingsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Check-in</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.customer_name}</TableCell>
            <TableCell>{booking.customer_email}</TableCell>
            <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
            <TableCell>JD {booking.total_price}</TableCell>
            <TableCell>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}