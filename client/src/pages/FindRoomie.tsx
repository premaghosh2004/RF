import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Heart, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { useProfiles } from '@/hooks/useProfiles';
import type { PublicUserProfile } from '@/types/profile';

const FindRoomie: React.FC = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [rentRange, setRentRange] = useState([800]);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Any' | undefined>(undefined);
  const [food, setFood] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Any' | undefined>(undefined);
  const [duration, setDuration] = useState<'1-3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Flexible' | undefined>(undefined);

  const { profiles, loading, error, setParams, refresh } = useProfiles({ limit: 12, sortBy: 'compatibility' });

  useEffect(() => {
    setParams(p => ({ ...p, city: city || undefined, gender, foodPreference: food, duration, minRent: 300, maxRent: rentRange[0] }));
  }, [city, gender, food, duration, rentRange, setParams]);

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--compatibility-high))';
    if (score >= 75) return 'hsl(var(--compatibility-medium))';
    return 'hsl(var(--compatibility-low))';
  };

  const toggleSave = async (id: string) => {
    try {
      const { data } = await api.post(`/profiles/${id}/save`);
      setSaved(prev => ({ ...prev, [id]: data?.data?.isSaved ?? !prev[id] }));
      refresh();
    } catch (_) { /* optionally surface toast */ }
  };

  const list: PublicUserProfile[] = useMemo(() => profiles, [profiles]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your <span className="text-gradient">Perfect Roommate</span></h1>
          <p className="text-muted-foreground">Browse profiles and connect with compatible roommates in your area</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(false)}>Close</Button>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Enter city or area" className="pl-10 bg-background" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender Preference</Label>
                  <Select onValueChange={(v) => setGender(v as any)}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Food Preference</Label>
                  <Select onValueChange={(v) => setFood(v as any)}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Rent Range (max)</Label>
                    <span className="text-sm text-muted-foreground">${rentRange[0]}</span>
                  </div>
                  <Slider value={rentRange} onValueChange={setRentRange} min={300} max={2000} step={50} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>$300</span><span>$2000</span></div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (Months)</Label>
                  <Select onValueChange={(v) => setDuration(v as any)}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Flexible">Any</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="12+ months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full gradient-primary text-white" onClick={() => refresh()}>
                  <Search className="w-4 h-4 mr-2" /> Apply Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <Button variant="outline" className="lg:hidden mb-6 w-full" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Show Filters
            </Button>

            {error && <div className="text-destructive mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-card border-border h-72 animate-pulse" />
                ))
              ) : (
                list.map((profile) => (
                  <Card key={profile._id} className="bg-card border-border hover-scale card-shadow overflow-hidden group">
                    <div className="relative">
                      <img src={profile.roomDetails?.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'} alt="Room" className="w-full h-48 object-cover" />
                      <Button size="icon" variant="secondary" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={() => toggleSave(profile._id)}>
                        <Heart className={`w-5 h-5 ${saved[profile._id] || profile.isSaved ? 'fill-destructive text-destructive' : ''}`} />
                      </Button>
                      {typeof profile.compatibility === 'number' && profile.compatibility >= 90 && (
                        <Badge className="absolute top-3 left-3 bg-green-500 text-white">Top Match</Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full ring-2 ring-primary/20" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" /> {profile.location.city}, {profile.location.state}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rent</span>
                          <span className="font-semibold flex items-center gap-1"><DollarSign className="w-4 h-4" />{profile.roomDetails?.rent || profile.preferences?.rentRange?.max}/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="font-medium">{profile.preferences?.duration || 'Flexible'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Food</span>
                          <Badge variant="outline">{profile.preferences?.foodPreference || 'Any'}</Badge>
                        </div>
                      </div>

                      {typeof profile.compatibility === 'number' && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Compatibility</span>
                            <span className="text-sm font-bold">{profile.compatibility}%</span>
                          </div>
                          <Progress value={profile.compatibility} className="h-2" style={{ '--progress-background': getCompatibilityColor(profile.compatibility) } as React.CSSProperties} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(profile.traits || []).slice(0, 4).map((trait, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{trait}</Badge>
                        ))}
                      </div>

                      <Button className="w-full gradient-primary text-white">View Profile</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindRoomie;
