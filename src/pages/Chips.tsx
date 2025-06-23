import Navigation from "@/components/Navigation";
import ChipDatabase from "../components/ChipDatabase";

const Chips = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Chips
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore all available chips. Filter by gear type to find the perfect boost for your equipment.
          </p>
        </div>

        <ChipDatabase />
      </main>
    </div>
  );
};

export default Chips;
