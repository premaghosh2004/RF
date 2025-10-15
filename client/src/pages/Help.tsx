import { useState, useEffect } from "react";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EmailJS configuration - matching your setup
  const SERVICE_ID = "service_7g2v9l4";
  const TEMPLATE_ID = "template_fmimmqx"; // Your auto-reply template
  const PUBLIC_KEY = "KeMnEAHfuPvNj02N7";

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  // Handle form submission with proper variable mapping
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Template parameters matching your EmailJS template exactly
      const templateParams = {
        name: formData.name,        // matches {{name}} in your template
        title: formData.message,    // matches {{title}} in your template
        email: formData.email,      // user's email for records
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log('EmailJS Success:', result);
      
      if (result.status === 200) {
        toast.success("Message sent successfully! You'll receive an auto-reply confirmation, and we'll respond within 3 business days.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error("Failed to send message. Please try again or contact us directly via phone/WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle phone call
  const handlePhoneClick = () => {
    window.location.href = "tel:+919046591533";
  };

  // Handle WhatsApp
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I need help with the RF roommate platform.");
    window.open(`https://wa.me/919046591533?text=${message}`, "_blank");
  };

  // Updated FAQs with RF-specific content
  const faqs = [
    {
      question: "How does RF work for finding roommates in Kolkata?",
      answer:
        "RF uses smart matching algorithms to connect you with compatible roommates across Kolkata. Create your profile, set preferences for areas like Salt Lake, New Town, or Park Street, and browse verified matches based on your budget and lifestyle.",
    },
    {
      question: "Is RF completely free to use?",
      answer:
        "Yes! Creating a profile, browsing roommates, viewing compatibility scores, and connecting with potential roommates is completely free. No hidden charges or premium subscriptions required.",
    },
    {
      question: "How do I verify if someone's profile is genuine?",
      answer:
        "We encourage email and phone verification for all users. Always meet potential roommates in public places first (like City Centre Mall or Park Street), video call before meeting, and trust your instincts before making commitments.",
    },
    {
      question: "Which areas in Kolkata does RF cover?",
      answer:
        "We cover all major Kolkata areas including Salt Lake (Sector I, II, III), New Town, Park Street, Ballygunge, Jadavpur, Tollygunge, Howrah, Gariahat, Behala, Garia, and surrounding metro-connected areas.",
    },
    {
      question: "What's the typical rent range for different Kolkata areas?",
      answer:
        "Rent varies by location: ₹3,000-8,000 in Garia/Behala, ₹8,000-15,000 in Jadavpur/Tollygunge, ₹12,000-20,000 in Ballygunge/Gariahat, and ₹15,000-25,000+ in premium areas like Salt Lake/New Town/Park Street.",
    },
    {
      question: "How does the compatibility scoring work?",
      answer:
        "Our algorithm analyzes lifestyle habits (early riser/night owl), food preferences (veg/non-veg), cleanliness levels, sleep schedules, smoking habits, and location preferences to calculate how compatible you are with potential roommates.",
    },
    {
      question: "Can I search for roommates in specific Kolkata localities?",
      answer:
        "Absolutely! You can filter by specific areas, metro station proximity, nearby colleges/offices, and even landmarks. Our local focus ensures you find roommates in your preferred neighborhoods with good connectivity.",
    },
    {
      question: "What should I do if I face any issues or need support?",
      answer:
        "Use the contact form below, call +91 9046591533, or WhatsApp us. We respond to all inquiries within 24 hours during business days (Mon-Sat, 9 AM - 6 PM IST).",
    },
  ];

  // Contact methods - Only Call Us and WhatsApp
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 9046591533",
      description: "Mon-Fri, 9 AM - 5 PM IST",
      action: handlePhoneClick,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 9046591533",
      description: "Quick chat support",
      action: handleWhatsAppClick,
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            How Can We <span className="text-gradient">Help?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get support for your Kolkata roommate search or reach out with any questions
          </p>
        </div>

        {/* Contact Methods - Centered for 2 boxes */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-card border-border hover-scale card-shadow text-center cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                onClick={method.action}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center glow-effect group-hover:scale-110 transition-transform">
                    <method.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{method.title}</h3>
                  <p className="text-primary font-semibold mb-2 text-lg">{method.value}</p>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-xs text-primary/70">Click to contact</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6 hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-card border-border card-shadow sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Send Us a <span className="text-gradient">Message</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  We'll send you an auto-reply confirmation and respond within 3 business days
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-background"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="bg-background"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you? Please describe your issue or question in detail..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={6}
                      className="bg-background resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white glow-effect hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground text-center">
                      📧 You'll receive an <span className="text-primary font-semibold">auto-reply confirmation</span> immediately
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      📞 For urgent issues, call or WhatsApp us directly
                    </p>
                  </div>
                  
                  <div className="text-center text-xs text-muted-foreground">
                    <p>Business Hours: Monday - Friday, 9:00 AM - 5:00 PM IST</p>
                    <p>We typically respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Help Section - Updated buttons */}
        <div className="mt-20 text-center bg-secondary/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you can't find the answer you're looking for, don't hesitate to reach out. 
            Our team is here to help you find the perfect roommate in Kolkata!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handlePhoneClick}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button 
              onClick={handleWhatsAppClick}
              className="gradient-primary text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

