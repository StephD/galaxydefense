
import Navigation from "@/components/Navigation";
import CardDatabase from "@/components/CardDatabase";

const Cards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Cards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore all available cards. Filter by turret type, card category, and tier to find the perfect combination.
          </p>
        </div>

        <CardDatabase />
      </main>
    </div>
  );
};

export default Cards;
