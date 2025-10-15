import { useState } from "react";
import { Search, SlidersHorizontal, Heart, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FindRoomie = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [rentRange, setRentRange] = useState([500]);
  const [savedProfiles, setSavedProfiles] = useState<number[]>([]);

  const profiles = [
    {
      id: 1,
      name: "Alex Kumar",
      age: 25,
      gender: "Male",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      roomImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
      rent: 800,
      location: "Downtown, NYC",
      foodPref: "Vegetarian",
      compatibility: 92,
      duration: "6 months",
      traits: ["Non-smoker", "Pet-friendly", "Early riser"],
    },
    {
      id: 2,
      name: "Emma Wilson",
      age: 23,
      gender: "Female",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      roomImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      rent: 950,
      location: "Brooklyn, NYC",
      foodPref: "Non-Vegetarian",
      compatibility: 88,
      duration: "12 months",
      traits: ["Non-smoker", "No pets", "Night owl"],
    },
    {
      id: 3,
      name: "James Lee",
      age: 27,
      gender: "Male",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      roomImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      rent: 700,
      location: "Queens, NYC",
      foodPref: "Any",
      compatibility: 85,
      duration: "3 months",
      traits: ["Smoker", "No pets", "Flexible schedule"],
    },
    {
      id: 4,
      name: "Sophia Martinez",
      age: 24,
      gender: "Female",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      roomImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400",
      rent: 850,
      location: "Manhattan, NYC",
      foodPref: "Vegetarian",
      compatibility: 95,
      duration: "9 months",
      traits: ["Non-smoker", "Cat owner", "Early riser"],
    },
  ];

  const toggleSave = (id: number) => {
    setSavedProfiles((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "hsl(var(--compatibility-high))";
    if (score >= 75) return "hsl(var(--compatibility-medium))";
    return "hsl(var(--compatibility-low))";
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Find Your <span className="text-gradient">Perfect Roommate</span>
          </h1>
          <p className="text-muted-foreground">
            Browse profiles and connect with compatible roommates in your area
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    Close
                  </Button>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Enter city or area" className="pl-10 bg-background" />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender Preference</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Food Preference */}
                <div className="space-y-2">
                  <Label>Food Preference</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rent Range */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Rent Range</Label>
                    <span className="text-sm text-muted-foreground">
                      ${rentRange[0]}
                    </span>
                  </div>
                  <Slider
                    value={rentRange}
                    onValueChange={setRentRange}
                    min={300}
                    max={2000}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$300</span>
                    <span>$2000</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Duration (Months)</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1-3">1-3 months</SelectItem>
                      <SelectItem value="3-6">3-6 months</SelectItem>
                      <SelectItem value="6-12">6-12 months</SelectItem>
                      <SelectItem value="12+">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full gradient-primary text-white glow-effect">
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden mb-6 w-full"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Show Filters
            </Button>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="bg-card border-border hover-scale card-shadow overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={profile.roomImage}
                      alt="Room"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => toggleSave(profile.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          savedProfiles.includes(profile.id)
                            ? "fill-destructive text-destructive"
                            : ""
                        }`}
                      />
                    </Button>
                    {profile.compatibility >= 90 && (
                      <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                        Top Match
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full ring-2 ring-primary/20"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Rent</span>
                        <span className="font-semibold flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {profile.rent}/month
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-medium">{profile.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Food</span>
                        <Badge variant="outline">{profile.foodPref}</Badge>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Compatibility</span>
                        <span className="text-sm font-bold">{profile.compatibility}%</span>
                      </div>
                      <Progress
                        value={profile.compatibility}
                        className="h-2"
                        style={{
                          "--progress-background": getCompatibilityColor(
                            profile.compatibility
                          ),
                        } as React.CSSProperties}
                      />
                    </div>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.traits.map((trait, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full gradient-primary text-white">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindRoomie;
