import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Calendar, LogOut, ArrowLeft, Phone, Building, Trash2 } from "lucide-react";
import { format } from "date-fns";

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().optional(),
  company: z.string().optional(),
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
}

interface ScheduledCall {
  id: string;
  guest_name: string;
  guest_email: string;
  scheduled_date: string;
  scheduled_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "", company: "" },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchScheduledCalls();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      profileForm.reset({
        fullName: data.full_name || "",
        phone: data.phone || "",
        company: data.company || "",
      });
    }
    setLoadingData(false);
  };

  const fetchScheduledCalls = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("scheduled_calls")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_date", { ascending: true });

    if (data) {
      setScheduledCalls(data);
    }
  };

  const onUpdateProfile = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        phone: data.phone || null,
        company: data.company || null,
      })
      .eq("user_id", user.id);

    setIsUpdating(false);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      fetchProfile();
    }
  };

  const handleCancelCall = async (callId: string) => {
    const { error } = await supabase
      .from("scheduled_calls")
      .update({ status: "cancelled" })
      .eq("id", callId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the call.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Call cancelled",
        description: "The scheduled call has been cancelled.",
      });
      fetchScheduledCalls();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-serif font-bold">Studio</Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8">My Dashboard</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="calls" className="gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled Calls
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="John Doe" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="+1 234 567 8900" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="Acme Inc." {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calls" className="animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Calls</CardTitle>
                  <CardDescription>View and manage your upcoming calls</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledCalls.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No scheduled calls yet</p>
                      <Link to="/#about">
                        <Button variant="outline" className="mt-4">Schedule a Call</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledCalls.map((call) => (
                        <div key={call.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{call.guest_name}</p>
                              <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{call.guest_email}</p>
                            <p className="text-sm">
                              {format(new Date(call.scheduled_date), "PPP")} at {call.scheduled_time}
                            </p>
                            {call.notes && (
                              <p className="text-sm text-muted-foreground mt-2">Notes: {call.notes}</p>
                            )}
                          </div>
                          {call.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelCall(call.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
