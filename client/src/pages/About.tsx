import { Target, Heart, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make finding the perfect roommate simple, safe, and stress-free for everyone looking to share their living space.",
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in building a supportive community where everyone can find compatible living arrangements.",
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description: "Your safety is our priority. We verify profiles and provide secure communication channels.",
    },
    {
      icon: Users,
      title: "Perfect Matches",
      description: "Our advanced compatibility algorithm ensures you find roommates who share your lifestyle and values.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Designer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      name: "David Kim",
      role: "Chief Technology Officer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            About <span className="text-gradient">RoomieMatch</span>
          </h1>
          <p className="text-xl text-foreground/90 max-w-3xl mx-auto animate-slide-up">
            We're on a mission to revolutionize how people find their perfect roommates. 
            Since 2024, we've helped thousands of people discover compatible living arrangements.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What We <span className="text-gradient">Stand For</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-card border-border hover-scale card-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 mb-4 rounded-lg gradient-primary flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Our <span className="text-gradient">Story</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                RoomieMatch was born from a simple frustration: finding a compatible roommate 
                shouldn't be this hard. Our founder, Sarah Johnson, spent weeks browsing countless 
                listings and meeting dozens of incompatible people before finally finding her 
                perfect roommate match.
              </p>
              <p>
                She realized there had to be a better way. What if technology could help match 
                people based on lifestyle compatibility, not just location and rent? That's when 
                RoomieMatch was created.
              </p>
              <p>
                Today, we use advanced matching algorithms to connect people who share similar 
                values, habits, and preferences. From cleanliness levels to sleep schedules, we 
                help you find someone you'll actually enjoy living with.
              </p>
              <p className="font-semibold text-foreground">
                Our goal is simple: make every roommate match a great match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Meet Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Passionate individuals dedicated to helping you find your perfect roommate
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-card border-border hover-scale card-shadow group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold">10,000+</div>
              <div className="text-lg text-foreground/80">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">5,000+</div>
              <div className="text-lg text-foreground/80">Successful Matches</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">50+</div>
              <div className="text-lg text-foreground/80">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
