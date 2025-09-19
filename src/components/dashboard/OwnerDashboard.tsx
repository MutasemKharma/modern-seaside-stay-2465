import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AvailabilityCalendar from "./AvailabilityCalendar";
import PricingManager from "./PricingManager";
import OwnerBookingsList from "./OwnerBookingsList";

export default function OwnerDashboard() {
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnerFarms();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      fetchFarmBookings(selectedFarm.id);
    }
  }, [selectedFarm]);

  const fetchOwnerFarms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      // Get farms owned by this user
      const { data: farmsData } = await supabase
        .from('farms')
        .select('*')
        .eq('owner_id', profile.id);

      setFarms(farmsData || []);
      if (farmsData && farmsData.length > 0) {
        setSelectedFarm(farmsData[0]);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your farms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmBookings = async (farmId: string) => {
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUpdateFarm = async (updates: any) => {
    if (!selectedFarm) return;

    try {
      const { error } = await supabase
        .from('farms')
        .update(updates)
        .eq('id', selectedFarm.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Farm updated successfully",
      });

      fetchOwnerFarms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update farm",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (farms.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Owner Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No farms assigned to your account yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Please contact the administrator.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Owner Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {farms.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Farm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {farms.map((farm) => (
                  <Button
                    key={farm.id}
                    variant={selectedFarm?.id === farm.id ? "default" : "outline"}
                    onClick={() => setSelectedFarm(farm)}
                  >
                    {farm.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedFarm && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{selectedFarm.name}</CardTitle>
                <CardDescription>{selectedFarm.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">JD {selectedFarm.base_price}</div>
                      <p className="text-muted-foreground">Base Price</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{selectedFarm.max_guests}</div>
                      <p className="text-muted-foreground">Max Guests</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{bookings.length}</div>
                      <p className="text-muted-foreground">Total Bookings</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="availability">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Availability</CardTitle>
                    <CardDescription>Set available dates for your farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityCalendar farmId={selectedFarm.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Management</CardTitle>
                    <CardDescription>Update base price and special pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PricingManager 
                      farm={selectedFarm} 
                      onUpdate={handleUpdateFarm}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>View all bookings for this farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OwnerBookingsList bookings={bookings} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}