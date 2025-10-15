import { UserPlus, Home as HomeIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  const navigate = useNavigate();

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
      {/* Hero Section - Clean without search */}
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
            Connect with compatible roommates in Kolkata. Safe, simple, and stress-free.
          </p>

          {/* Primary CTA - Direct action */}
          <div className="space-y-4 animate-slide-up">
            <Button
              onClick={() => navigate("/find-roomie")}
              size="lg"
              className="h-14 px-10 text-lg gradient-primary text-white font-semibold glow-effect hover:opacity-90 transition-opacity"
            >
              Start Finding Roommates
            </Button>
            <p className="text-sm text-foreground/70">
              Join thousands in Kolkata
            </p>
          </div>
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

         
        </div>
      </section>

      {/* Features Section - Added value instead of search */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Why Choose <span className="text-gradient">Our Platform?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">🏙️</div>
                <h3 className="font-semibold mb-2">Kolkata Focused</h3>
                <p className="text-sm text-muted-foreground">Local expertise for better matches</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">🛡️</div>
                <h3 className="font-semibold mb-2">Safe & Verified</h3>
                <p className="text-sm text-muted-foreground">Trusted community with verified profiles</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">AI-powered compatibility algorithm</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Quick Connect</h3>
                <p className="text-sm text-muted-foreground">Find roommates in minutes, not weeks</p>
              </div>
            </div>
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
            Join hundreds of happy roommates who found their perfect living situation in Kolkata
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/find-roomie")}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold mr-4"
            >
              Get Started Now
            </Button>
            <Button
              onClick={() => navigate("/about")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
