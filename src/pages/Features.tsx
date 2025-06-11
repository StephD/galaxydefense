
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, MessageSquare, Trophy, Map, Sword } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Database,
      title: "Game Database",
      description: "Comprehensive database with all game data, items, characters, and stats. Search and filter through thousands of entries.",
      highlight: true
    },
    {
      icon: Users,
      title: "Player Profiles",
      description: "Create your player profile, track achievements, and connect with other community members.",
      highlight: false
    },
    {
      icon: MessageSquare,
      title: "Community Forums",
      description: "Discuss strategies, share tips, and connect with fellow players in our vibrant forums.",
      highlight: false
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Compete with other players and climb the rankings in various game categories.",
      highlight: false
    },
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Explore detailed maps with locations, secrets, and important points of interest.",
      highlight: false
    },
    {
      icon: Sword,
      title: "Build Calculator",
      description: "Theory-craft and optimize your character builds with our advanced calculator tools.",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Website Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover all the tools and features that make our community the best place for gamers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                feature.highlight ? 'ring-2 ring-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className={`h-12 w-12 ${
                    feature.highlight ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <CardTitle className="text-xl">
                  {feature.title}
                  {feature.highlight && (
                    <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Coming First
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-secondary/30 rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Database Feature - Coming Soon!</h2>
            <p className="text-muted-foreground text-lg">
              Our comprehensive game database will be the first feature to launch. It will include 
              detailed information about items, characters, quests, locations, and much more. 
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
