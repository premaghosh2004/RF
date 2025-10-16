import { useState, useEffect, useRef } from "react";
import { Camera, Save, Eye, MapPin, IndianRupee, Calendar } from "lucide-react";
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const loadCompleteProfileData = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.data.user) {
          const userData = data.data.user;
          setProfileData({
            name: userData.username || "",
            email: userData.email || user.email || "",
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
      const response = await fetch('http://localhost:5001/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const updateResponse = await fetch("http://localhost:5001/api/auth/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: data.data.image.url }),
        });
        if (updateResponse.ok) {
          toast.success('Profile picture updated!');
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

  const handleRoomPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;
    setIsUploadingRoom(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('http://localhost:5001/api/upload/room-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const updateResponse = await fetch("http://localhost:5001/api/auth/profile/update", {
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
      // 1. Update basic user profile info
      const profileResponse = await fetch("http://localhost:5001/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          age: profileData.age,
          phone: profileData.phone,
          email: profileData.email,  // Add this line
          bio: profileData.bio,
          gender: profileData.gender,
          foodPref: profileData.foodPref,
          smoking: profileData.smoking,
          pets: profileData.pets,
          cleanliness: profileData.cleanliness,
          sleepSchedule: profileData.sleepSchedule,
        }),
      });
  
      const profileDataRes = await profileResponse.json();
      if (!profileDataRes.success) {
        throw new Error(profileDataRes.message || "Failed to update basic profile");
      }
  
      // 2. Update room details
      const roomResponse = await fetch("http://localhost:5001/api/profiles/post-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          rent: profileData.rent,
          duration: profileData.duration,
          location: profileData.location,
          images: [], // placeholder, or replace with your upload image URLs
        }),
      });
  
      const roomDataRes = await roomResponse.json();
      if (!roomDataRes.success) {
        throw new Error(roomDataRes.message || "Failed to update room info");
      }
  
      toast.success("Profile and room updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    toast.info("Preview feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Your <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your profile information and roommate preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <main className="lg:col-span-2 space-y-6">
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

                {profileData.location && profileData.location.includes(",") ? (
                  (() => {
                        const [lat, lon] = profileData.location.split(",").map(Number);
                        return (
                          <div className="mt-2 rounded-lg overflow-hidden">
                            <iframe
                              title="Room Location Map"
                              width="100%"
                              height="200"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`}
                            ></iframe>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="mt-2 rounded-lg overflow-hidden">
                        <iframe
                          title="Room Location Map"
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(
                            profileData.location
                          )}`}
                        ></iframe>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const { latitude, longitude } = pos.coords;
                          setProfileData({
                            ...profileData,
                            location: `${latitude}, ${longitude}`,
                          });
                        });
                      }}
                    >
                      Use My Location
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent" className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-primary" />
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