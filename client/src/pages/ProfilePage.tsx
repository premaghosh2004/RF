import { useState, useEffect, useRef } from "react";
import { Camera, Save, Eye, MapPin, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingRoom, setIsUploadingRoom] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const roomPhotoInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    gender: "male",
    age: "",
    phone: "",
    location: "",
    rent: "",
    duration: "",
    bio: "",
    foodPref: "vegetarian",
    smoking: false,
    pets: false,
    cleanliness: "high",
    sleepSchedule: "early",
  });

  // Wait for auth to finish loading before redirecting
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // CHANGED: Load complete profile data from database
  useEffect(() => {
    const loadCompleteProfileData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        if (data.success && data.data.user) {
          const userData = data.data.user;
          setProfileData({
            name: userData.username || "",
            email: userData.email || "",
            bio: userData.bio || "",
            location: userData.location || "",
            age: userData.age?.toString() || "",
            phone: userData.phone || "",
            gender: userData.gender || "male",
            rent: userData.rent?.toString() || "",
            duration: userData.duration?.toString() || "",
            foodPref: userData.foodPref || "vegetarian",
            smoking: userData.smoking || false,
            pets: userData.pets || false,
            cleanliness: userData.cleanliness || "high",
            sleepSchedule: userData.sleepSchedule || "early",
          });
        }
      } catch (error) {
        console.error('Error loading complete profile data:', error);
      }
    };
    
    if (user && token) {
      loadCompleteProfileData();
    }
  }, [user, token]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // UPDATE: Also update the user's avatar in database
        const updateResponse = await fetch("http://localhost:5000/api/auth/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: data.data.image.url }),
        });

        if (updateResponse.ok) {
          toast.success('Profile picture updated!');
          // Refresh the page or update auth context
          window.location.reload();
        } else {
          toast.error('Failed to save avatar to profile');
        }
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Network error during upload');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // CHANGED: Updated room photo upload to use /room-photo endpoint
  const handleRoomPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setIsUploadingRoom(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/room-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Save room photo URL to profile
        const updateResponse = await fetch("http://localhost:5000/api/auth/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ roomPhoto: data.data.image.url }),
        });

        if (updateResponse.ok) {
          toast.success('Room photo updated!');
        } else {
          toast.error('Failed to save room photo');
        }
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Room upload error:', error);
      toast.error('Network error during upload');
    } finally {
      setIsUploadingRoom(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Please login to update your profile");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    toast.info("Preview feature coming soon!");
  };

  // Show loading while auth initializes
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  // Show redirect message only after loading completes
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Your <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your profile information and roommate preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <aside className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative mx-auto w-40 h-40">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt="Profile"
                      className="w-full h-full rounded-full ring-4 ring-primary/20"
                    />
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full gradient-primary text-white"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.isVerified && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-2">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">Room Photo</h4>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400"
                      alt="Room"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <input
                      type="file"
                      ref={roomPhotoInputRef}
                      onChange={handleRoomPhotoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 rounded-full gradient-primary text-white"
                      onClick={() => roomPhotoInputRef.current?.click()}
                      disabled={isUploadingRoom}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload a clear photo of your available room
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <Button
                    onClick={handleSave}
                    className="w-full gradient-primary text-white glow-effect"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Form */}
          <main className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      className="bg-background"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, gender: value })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) =>
                        setProfileData({ ...profileData, age: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    rows={4}
                    className="bg-background resize-none"
                    placeholder="Tell potential roommates about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Room Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({ ...profileData, location: e.target.value })
                      }
                      className="bg-background"
                      placeholder="City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Monthly Rent
                    </Label>
                    <Input
                      id="rent"
                      type="number"
                      value={profileData.rent}
                      onChange={(e) =>
                        setProfileData({ ...profileData, rent: e.target.value })
                      }
                      className="bg-background"
                      placeholder="800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Duration (Months)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={profileData.duration}
                      onChange={(e) =>
                        setProfileData({ ...profileData, duration: e.target.value })
                      }
                      className="bg-background"
                      placeholder="6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roommate Preferences */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Roommate Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="foodPref">Food Preference</Label>
                    <Select
                      value={profileData.foodPref}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, foodPref: value })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cleanliness">Cleanliness Level</Label>
                    <Select
                      value={profileData.cleanliness}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, cleanliness: value })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="very-high">Very High</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                    <Select
                      value={profileData.sleepSchedule}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, sleepSchedule: value })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="early">Early Riser (6-8 AM)</SelectItem>
                        <SelectItem value="regular">Regular (8-10 AM)</SelectItem>
                        <SelectItem value="late">Night Owl (10+ AM)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="space-y-1">
                      <Label htmlFor="smoking" className="text-base font-medium">
                        Smoking
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Do you smoke or accept smokers?
                      </p>
                    </div>
                    <Switch
                      id="smoking"
                      checked={profileData.smoking}
                      onCheckedChange={(checked) =>
                        setProfileData({ ...profileData, smoking: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="space-y-1">
                      <Label htmlFor="pets" className="text-base font-medium">
                        Pets
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Do you have pets or accept them?
                      </p>
                    </div>
                    <Switch
                      id="pets"
                      checked={profileData.pets}
                      onCheckedChange={(checked) =>
                        setProfileData({ ...profileData, pets: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

