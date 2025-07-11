import Navigation from "@/components/Navigation";
import CardDatabase from "@/components/CardDatabase";

const Cards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Cards
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore all available cards. Filter by turret type, card category, and tier to find the perfect combination.
          </p>
        </div>
        <hr />
        <CardDatabase />
      </main>
    </div>
  );
};

export default Cards;
