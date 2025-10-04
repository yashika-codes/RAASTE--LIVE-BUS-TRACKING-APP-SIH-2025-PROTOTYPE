import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Server, 
  Database, 
  Wifi, 
  Code, 
  Map,
  Zap,
  Shield
} from "lucide-react";

const TechStack = () => {
  const technologies = [
    {
      category: "Mobile Development",
      icon: Smartphone,
      tech: "Flutter / React Native",
      description: "Cross-platform apps for maximum reach",
      color: "bg-primary/10 text-primary"
    },
    {
      category: "Backend Server",
      icon: Server,
      tech: "Node.js / FastAPI",
      description: "High-performance real-time processing",
      color: "bg-secondary/10 text-secondary"
    },
    {
      category: "Database",
      icon: Database,
      tech: "MongoDB with PostGIS",
      description: "Geospatial queries and location indexing",
      color: "bg-accent/10 text-accent"
    },
    {
      category: "Communication Protocol",
      icon: Wifi,
      tech: "MQTT",
      description: "Ultra-low bandwidth IoT messaging",
      color: "bg-primary/10 text-primary"
    },
    {
      category: "Data Format",
      icon: Code,
      tech: "Protocol Buffers",
      description: "60-80% smaller than JSON",
      color: "bg-secondary/10 text-secondary"
    },
    {
      category: "Mapping Service",
      icon: Map,
      tech: "OpenStreetMap / Mapbox",
      description: "Cost-effective mapping solution",
      color: "bg-accent/10 text-accent"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Ultra-Low Bandwidth",
      description: "Optimized for 2G/3G networks with minimal data usage"
    },
    {
      icon: Shield,
      title: "Offline-First Architecture",
      description: "Continues working even during network interruptions"
    },
    {
      icon: Smartphone,
      title: "Zero Hardware Cost",
      description: "Uses existing driver smartphones as tracking devices"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for
            <span className="block bg-tech-gradient bg-clip-text text-transparent">
              Low-Bandwidth Excellence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our technology stack is specifically chosen to deliver enterprise-grade 
            performance in challenging network conditions.
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-500 border-0 bg-card-gradient overflow-hidden hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {tech.category}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {tech.tech}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-10">Why This Stack Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Innovation Highlight */}
        <div className="mt-20 text-center bg-hero-gradient p-12 rounded-3xl text-white">
          <h3 className="text-3xl font-bold mb-6">The Innovation Edge</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
            Unlike expensive enterprise solutions requiring dedicated hardware, 
            our approach leverages existing smartphone infrastructure with 
            cutting-edge protocols designed for constrained environments.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold mb-1">15-30s</div>
              <div className="text-sm opacity-75">Update Interval</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">&lt;100B</div>
              <div className="text-sm opacity-75">Per Update</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">99.9%</div>
              <div className="text-sm opacity-75">Uptime Target</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">Real-time</div>
              <div className="text-sm opacity-75">Sync Speed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;