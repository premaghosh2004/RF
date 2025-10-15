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
                shouldn't be this hard. Our founders, Prema and her co-founder, experienced firsthand 
                the challenges of finding the right living partner in today's busy world.
              </p>
              <p>
                They realized there had to be a better way. What if technology could help match 
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

      {/* Team Section - Direct Image Implementation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Meet Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Two passionate individuals dedicated to helping you find your perfect roommate
          </p>

          {/* Centered grid for 2 members with larger cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
              
              {/* Prema's Card */}
              <Card className="bg-card border-border hover-scale card-shadow group w-full max-w-sm mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary transition-all">
                    <img
                      src="/Passport_size.jpg"
                      alt="Prema Ghosh - Founder & CEO"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to prema.png if Passport_size.jpg fails
                        e.currentTarget.src = "/prema.png";
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Prema Ghosh</h3>
                  <p className="text-primary font-medium text-lg mb-4">Founder & Full Stack Developer</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                   Tech enthusiast dedicated to building innovative matching algorithms and seamless user experiences. 
                  </p>
                </CardContent>
              </Card>

              {/* Second Team Member Card */}
              <Card className="bg-card border-border hover-scale card-shadow group w-full max-w-sm mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary transition-all">
                    <img
                      src="/sagnik.jpg"
                      alt="Co-Founder"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to dicebear avatar if prema.png fails
                        e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Cofounder";
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sagnik Biswas</h3>
                  <p className="text-primary font-medium text-lg mb-4">Co-Founder & Full Stack Developer</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Passionate about creating safe, community-driven solutions for modern living challenges and building smart, scalable tech solutions.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-hero">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">
        Serving <span className="text-white">Kolkata</span>
      </h2>
      <p className="text-xl text-foreground/90 max-w-2xl mx-auto">
        Building the largest roommate community in the City of Joy
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="space-y-2">
        <div className="text-5xl font-bold">25+</div>
        <div className="text-lg text-foreground/80">Kolkata Areas</div>
        <div className="text-sm text-foreground/60">
          Salt Lake, New Town, Park Street, Howrah & more
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold">500+</div>
        <div className="text-lg text-foreground/80">Active Listings</div>
        <div className="text-sm text-foreground/60">
          Fresh roommate opportunities daily
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold">₹3K-25K</div>
        <div className="text-lg text-foreground/80">Rent Range</div>
        <div className="text-sm text-foreground/60">
          Options for every budget in Kolkata
        </div>
      </div>
    </div>

    {/* Popular Areas */}
    <div className="mt-16 text-center">
      <h3 className="text-2xl font-bold mb-6 text-white">Popular Areas We Cover</h3>
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {[
          'Salt Lake', 'New Town', 'Park Street', 'Howrah', 'Ballygunge', 
          'Gariahat', 'Jadavpur', 'Tollygunge', 'Garia', 'Behala',
          'Dum Dum', 'Barasat', 'Rajarhat', 'Kestopur', 'Baguiati'
        ].map((area, index) => (
          <span 
            key={index}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            {area}
          </span>
        ))}
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default About;

