import { ApiDemo } from "@/components/ApiDemo";
import Navigation from "@/components/Navigation";

export default function ApiData() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API Data</h1>
        <ApiDemo />
      </main>
    </div>
  );
}
