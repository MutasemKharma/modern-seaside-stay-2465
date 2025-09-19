import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FarmsList from "./FarmsList";
import AddFarmDialog from "./AddFarmDialog";
import BookingsList from "./BookingsList";

export default function AdminDashboard() {
  const [farms, setFarms] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch farms
      const { data: farmsData } = await supabase
        .from('farms')
        .select('*, profiles:owner_id(id, full_name, user_id)')
        .order('created_at', { ascending: false });

      // Fetch owners (profiles with role 'owner')
      const { data: ownersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner');

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, farms(name)')
        .order('created_at', { ascending: false });

      setFarms(farmsData || []);
      setOwners(ownersData || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAddFarm = async (farmData: any) => {
    try {
      const { error } = await supabase
        .from('farms')
        .insert([farmData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Farm added successfully",
      });

      fetchData();
      setShowAddFarm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add farm",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFarm = async (farmId: string) => {
    try {
      const { error } = await supabase
        .from('farms')
        .delete()
        .eq('id', farmId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Farm deleted successfully",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete farm",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
            <CardDescription>Manage farms, owners, and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{farms.length}</div>
                  <p className="text-muted-foreground">Total Farms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{owners.length}</div>
                  <p className="text-muted-foreground">Farm Owners</p>
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

        <Tabs defaultValue="farms">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="farms">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Farms Management</CardTitle>
                  <Button onClick={() => setShowAddFarm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <FarmsList 
                  farms={farms} 
                  onDelete={handleDeleteFarm}
                  onUpdate={fetchData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsList bookings={bookings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddFarmDialog 
          open={showAddFarm}
          onClose={() => setShowAddFarm(false)}
          onAdd={handleAddFarm}
          owners={owners}
        />
      </main>
    </div>
  );
}