import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AvailabilityCalendarProps {
  farmId: string;
}

export default function AvailabilityCalendar({ farmId }: AvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    fetchAvailability();
  }, [farmId]);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('date, is_available')
      .eq('farm_id', farmId)
      .eq('is_available', true);

    if (data) {
      setAvailableDates(data.map(d => new Date(d.date)));
    }
  };

  const toggleAvailability = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isCurrentlyAvailable = availableDates.some(d => 
      d.toISOString().split('T')[0] === dateStr
    );

    try {
      if (isCurrentlyAvailable) {
        await supabase
          .from('availability')
          .update({ is_available: false })
          .eq('farm_id', farmId)
          .eq('date', dateStr);
      } else {
        await supabase
          .from('availability')
          .insert({ farm_id: farmId, date: dateStr, is_available: true });
      }
      
      fetchAvailability();
      toast({
        title: "Success",
        description: "Availability updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Calendar
        mode="multiple"
        selected={availableDates}
        onSelect={(dates) => {
          if (dates && dates.length > 0) {
            const lastDate = dates[dates.length - 1];
            toggleAvailability(lastDate);
          }
        }}
        className="rounded-md border"
      />
      <p className="text-sm text-muted-foreground mt-4">
        Click on dates to toggle availability. Green dates are available.
      </p>
    </div>
  );
}