import { useState } from "react";
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

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      question: "How does RoomieMatch work?",
      answer:
        "RoomieMatch uses an advanced matching algorithm to connect you with compatible roommates based on your preferences, lifestyle, and habits. Simply create a profile, set your preferences, and browse potential matches in your area.",
    },
    {
      question: "Is RoomieMatch free to use?",
      answer:
        "Yes! Creating a profile and browsing roommates is completely free. We also offer premium features for enhanced visibility and advanced filtering options.",
    },
    {
      question: "How do I verify someone's profile?",
      answer:
        "We encourage all users to verify their profiles through email and phone verification. You can also request video calls before meeting in person to ensure authenticity.",
    },
    {
      question: "What if I have safety concerns?",
      answer:
        "Your safety is our top priority. Always meet potential roommates in public places first, trust your instincts, and report any suspicious behavior to our support team immediately.",
    },
    {
      question: "Can I edit my preferences later?",
      answer:
        "Absolutely! You can update your profile, room details, and preferences anytime from your profile page. Changes will be reflected immediately in your matches.",
    },
    {
      question: "How does the compatibility score work?",
      answer:
        "Our compatibility score analyzes multiple factors including lifestyle habits, cleanliness preferences, sleep schedules, and other criteria you've set to calculate how well you match with potential roommates.",
    },
    {
      question: "What should I do if I find my perfect roommate?",
      answer:
        "Congratulations! You can communicate through our platform to arrange viewings and discuss terms. We recommend having a written agreement before moving in together.",
    },
    {
      question: "How do I report a problem?",
      answer:
        "Use the contact form below or email us directly at support@roomiematch.com. Our team responds to all inquiries within 24 hours.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@roomiematch.com",
      description: "Get a response within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9 AM - 6 PM EST",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      value: "Available soon",
      description: "Chat with our support team",
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
            Find answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="bg-card border-border hover-scale card-shadow text-center"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center glow-effect">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{method.title}</h3>
                <p className="text-primary font-semibold mb-1">{method.value}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </CardContent>
            </Card>
          ))}
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
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
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
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={6}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white glow-effect"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground text-center">
                    We typically respond within <span className="text-primary font-semibold">24 hours</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
