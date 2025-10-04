import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Zap, Globe } from "lucide-react";

const MissionSection = () => {
  const missions = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To democratize public transportation technology by making real-time bus tracking accessible to tier-2 cities with limited digital infrastructure.",
      color: "text-primary"
    },
    {
      icon: Heart,
      title: "Our Vision",
      description: "A future where every commuter, regardless of their city's infrastructure, has access to reliable, real-time public transportation information.",
      color: "text-secondary"
    },
    {
      icon: Zap,
      title: "Innovation Focus",
      description: "Leveraging MQTT protocols and data compression to deliver enterprise-grade solutions that work seamlessly on 2G networks.",
      color: "text-accent"
    },
    {
      icon: Globe,
      title: "Social Impact",
      description: "Reducing wait times, improving commuter experience, and optimizing public transport efficiency across emerging urban centers.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Driving Change Through
            <span className="block bg-tech-gradient bg-clip-text text-transparent">
              Smart Technology
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our solution addresses the critical gap in public transportation technology 
            for tier-2 cities, focusing on accessibility and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {missions.map((mission, index) => {
            const IconComponent = mission.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-500 border-0 bg-card-gradient overflow-hidden hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-background shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${mission.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {mission.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Achievements */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-12">Key Innovations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">90%</div>
              <div className="text-sm text-muted-foreground">Data Reduction vs JSON</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">2G+</div>
              <div className="text-sm text-muted-foreground">Network Compatibility</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform">Zero</div>
              <div className="text-sm text-muted-foreground">Hardware Investment</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm text-muted-foreground">Offline Capability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;