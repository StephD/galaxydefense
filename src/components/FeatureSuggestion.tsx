import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFeatureSuggestions, useUpvoteFeature, FeatureSuggestion as FeatureSuggestionType } from "@/hooks/useFeatureSuggestions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";



const FeatureSuggestion = () => {
  const { data: suggestions = [], isLoading, error } = useFeatureSuggestions();
  const upvoteMutation = useUpvoteFeature();
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Load user votes from localStorage on component mount
  useEffect(() => {
    const storedUserVotes = localStorage.getItem("userFeatureVotes");
    if (storedUserVotes) {
      setUserVotes(JSON.parse(storedUserVotes));
    }
  }, []);

  // Save user votes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userFeatureVotes", JSON.stringify(userVotes));
  }, [userVotes]);

  // Handle upvoting a feature
  const handleUpvote = (id: string) => {
    // Check if user has already voted for this feature
    if (userVotes[id]) {
      toast({
        title: "Already voted",
        description: "You've already voted for this feature",
        variant: "destructive"
      });
      return;
    }

    // Call the upvote mutation
    upvoteMutation.mutate(id, {
      onSuccess: () => {
        // Record that user has voted for this feature
        setUserVotes(prev => ({ ...prev, [id]: true }));
        
        toast({
          title: "Vote recorded",
          description: "Thanks for your feedback!"
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to record your vote. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Get status badge color
  const getStatusColor = (status: string | null | undefined) => {
    // Default to considering if status is null or undefined
    const safeStatus = status || "considering";
    
    switch (safeStatus) {
      case "planned":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "in-progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "considering":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6">
        <h3 className="text-2xl font-semibold mb-4 text-center">Upcoming Features</h3>
        <p className="text-muted-foreground text-center mb-6">Vote for features you'd like to see next!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6 text-center text-red-500">
        <h3 className="text-2xl font-semibold mb-4">Error Loading Features</h3>
        <p>Sorry, we couldn't load the feature suggestions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h3 className="text-2xl font-semibold mb-4 text-center">Upcoming Features</h3>
      <p className="text-muted-foreground text-center mb-6">Vote for features you'd like to see next!</p>
      
      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No feature suggestions available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map(suggestion => (
            <Card key={suggestion.id} className="border border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  <div>
                    <Badge variant="outline" className={getStatusColor(suggestion.status)}>
                      {suggestion.status ? suggestion.status.toString().replace("-", " ") : "considering"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>{suggestion.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {suggestion.votes || 0} votes
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUpvote(suggestion.id)}
                  disabled={userVotes[suggestion.id] || upvoteMutation.isPending}
                  className={userVotes[suggestion.id] ? "bg-primary/10" : ""}
                >
                  {upvoteMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {userVotes[suggestion.id] ? "Voted" : "Upvote"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureSuggestion;
