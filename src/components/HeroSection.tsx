
import FeatureSuggestion from "./FeatureSuggestion";

const HeroSection = () => {
  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Galaxy Defense Wiki
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome, Guardian! Explore our comprehensive database of cards and chips to optimize your strategy.
          </p>
        </div>
        <hr />
        <FeatureSuggestion />
      </main>
    </>
  );
};

export default HeroSection;
