import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import customerAppMockup from "@/assets/customer-app-mockup.jpg";
import driverAppMockup from "@/assets/driver-app-mockup.jpg";
import { Users, Car, Smartphone, Wifi } from "lucide-react";

const AppShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Two Apps, One Solution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our dual-app ecosystem addresses both commuter needs and operational efficiency 
            with minimal infrastructure requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Customer App */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card-gradient overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Commuter App</h3>
                  <Badge variant="secondary" className="mt-1">For Passengers</Badge>
                </div>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={customerAppMockup}
                    alt="Customer App Interface"
                    className="w-64 h-auto rounded-2xl shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Real-time Bus Tracking</h4>
                    <p className="text-sm text-muted-foreground">Live location updates with ETA predictions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Low-Data Mode</h4>
                    <p className="text-sm text-muted-foreground">Works seamlessly on 2G/3G networks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Smart Notifications</h4>
                    <p className="text-sm text-muted-foreground">Custom alerts for your routes and stops</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver App */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card-gradient overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Car className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Driver App</h3>
                  <Badge variant="outline" className="mt-1 border-secondary text-secondary">For Operators</Badge>
                </div>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={driverAppMockup}
                    alt="Driver App Interface"
                    className="w-64 h-auto rounded-2xl shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent rounded-2xl"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">One-Click Trip Start</h4>
                    <p className="text-sm text-muted-foreground">Simple interface for non-tech-savvy drivers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Offline Data Sync</h4>
                    <p className="text-sm text-muted-foreground">Buffers location data during network outages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Battery Optimized</h4>
                    <p className="text-sm text-muted-foreground">Minimal power consumption with smart polling</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;