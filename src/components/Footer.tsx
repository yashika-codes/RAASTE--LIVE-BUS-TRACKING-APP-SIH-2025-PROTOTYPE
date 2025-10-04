import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Award } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold">Smart India Hackathon 2024</h3>
          </div>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Revolutionizing public transportation in tier 2 and 3 cities through 
            innovative low-bandwidth solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">Problem Statement</h4>
            <p className="text-muted text-sm leading-relaxed">
              Developing a comprehensive bus tracking and management system 
              for tier 2 and 3 cities with limited digital infrastructure and 
              low-bandwidth environments.
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">Our Solution</h4>
            <p className="text-muted text-sm leading-relaxed">
              A dual-app ecosystem using MQTT protocols and Protocol Buffers 
              to deliver real-time tracking that works seamlessly on 2G networks 
              without any hardware investment.
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">Impact</h4>
            <p className="text-muted text-sm leading-relaxed">
              Reducing commuter wait times, improving transport efficiency, 
              and making smart city solutions accessible to emerging urban centers 
              across India.
            </p>
          </div>
        </div>

        <div className="text-center border-t border-muted/20 pt-8">
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-muted text-muted hover:bg-muted hover:text-foreground"
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-muted text-muted hover:bg-muted hover:text-foreground"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Team
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-muted text-muted hover:bg-muted hover:text-foreground"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
          
          <p className="text-muted text-sm">
            Built with ❤️ for Smart India Hackathon 2024 • 
            Empowering Tier 2 and 3 Cities Through Technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;