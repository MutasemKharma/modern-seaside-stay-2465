import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface BookingsListProps {
  bookings: any[];
}

export default function BookingsList({ bookings }: BookingsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Farm</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Check-in</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.farms?.name}</TableCell>
            <TableCell>{booking.customer_name}</TableCell>
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