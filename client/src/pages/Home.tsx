import { useState } from "react";
import { Search, MapPin, DollarSign, UserPlus, Home as HomeIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const handleSearch = () => {
    navigate(`/find-roomie?location=${location}&maxRent=${maxRent}`);
  };

  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your profile in minutes with your preferences and requirements",
    },
    {
      icon: HomeIcon,
      title: "Add Your Room",
      description: "List your available room with photos, rent, and location details",
    },
    {
      icon: CheckCircle,
      title: "Find Roommate",
      description: "Browse matches based on compatibility and connect instantly",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-80"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Perfect{" "}
            <span className="text-gradient">Roommate</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-12 max-w-2xl mx-auto animate-slide-up">
            Connect with compatible roommates in your city. Safe, simple, and stress-free.
          </p>

          {/* Search Bar */}
          <Card className="max-w-3xl mx-auto bg-card/95 backdrop-blur-md border-border card-shadow animate-slide-up">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 bg-background border-border"
                  />
                </div>
                <div className="flex-1 relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Max rent..."
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    className="pl-10 h-12 bg-background border-border"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 gradient-primary text-white font-semibold glow-effect hover:opacity-90 transition-opacity"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get started in three simple steps and find your ideal roommate today
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="bg-card border-border hover-scale cursor-pointer card-shadow group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center glow-effect">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4"></div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/find-roomie")}
              size="lg"
              className="gradient-primary text-white font-semibold glow-effect hover:opacity-90 transition-opacity"
            >
              Start Finding Roommates
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 text-foreground/90 max-w-2xl mx-auto">
            Join thousands of happy roommates who found their perfect living situation
          </p>
          <Button
            onClick={() => navigate("/find-roomie")}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
