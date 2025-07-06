import { useState, useEffect } from 'react';
import { TurretData } from '@/lib/turretService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { InfoIcon, AlertCircleIcon } from 'lucide-react';

export function ApiDemo() {
  const [allTurrets, setAllTurrets] = useState<TurretData[] | null>(null);
  const [singleTurret, setSingleTurret] = useState<TurretData | null>(null);
  const [turretsByType, setTurretsByType] = useState<TurretData[] | null>(null);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({all: false, single: false, type: false});
  const [error, setError] = useState<{[key: string]: string | null}>({all: null, single: null, type: null});
  const [searchName, setSearchName] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');

  // Fetch all turrets
  const fetchAllTurrets = async () => {
    try {
      setLoading(prev => ({...prev, all: true}));
      setError(prev => ({...prev, all: null}));
      setAllTurrets(null);
      
      const response = await fetch('/api/turrets');
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setAllTurrets(jsonData);
    } catch (err) {
      setError(prev => ({...prev, all: err instanceof Error ? err.message : 'An unknown error occurred'}));
      console.error('Error fetching all turrets:', err);
    } finally {
      setLoading(prev => ({...prev, all: false}));
    }
  };

  // Fetch a single turret by name
  const fetchTurretByName = async () => {
    if (!searchName.trim()) {
      setError(prev => ({...prev, single: 'Please enter a turret name'}));
      return;
    }

    try {
      setLoading(prev => ({...prev, single: true}));
      setError(prev => ({...prev, single: null}));
      setSingleTurret(null);
      
      const encodedName = encodeURIComponent(searchName.trim());
      // Make sure we're using the correct URL format
      const response = await fetch(`/api/turret?name=${encodedName}`);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
      }
      
      if (response.status === 404) {
        setError(prev => ({...prev, single: `Turret '${searchName}' not found`}));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setSingleTurret(jsonData);
    } catch (err) {
      setError(prev => ({...prev, single: err instanceof Error ? err.message : 'An unknown error occurred'}));
      console.error('Error fetching turret by name:', err);
    } finally {
      setLoading(prev => ({...prev, single: false}));
    }
  };

  // Fetch turrets by type
  const fetchTurretsByType = async () => {
    if (!searchType.trim()) {
      setError(prev => ({...prev, type: 'Please enter a turret type'}));
      return;
    }

    try {
      setLoading(prev => ({...prev, type: true}));
      setError(prev => ({...prev, type: null}));
      setTurretsByType(null);
      
      const encodedType = encodeURIComponent(searchType.trim());
      // Use query parameter format for consistency
      const response = await fetch(`/api/turrets?type=${encodedType}`);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setTurretsByType(jsonData);
    } catch (err) {
      setError(prev => ({...prev, type: err instanceof Error ? err.message : 'An unknown error occurred'}));
      console.error('Error fetching turrets by type:', err);
    } finally {
      setLoading(prev => ({...prev, type: false}));
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Turrets</TabsTrigger>
          <TabsTrigger value="byName">Search by Name</TabsTrigger>
          <TabsTrigger value="byType">Search by Type</TabsTrigger>
        </TabsList>
        
        {/* All Turrets Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Turrets</h2>
            <Button 
              onClick={fetchAllTurrets} 
              disabled={loading.all}
              variant="default"
            >
              {loading.all ? 'Loading...' : 'Fetch All Turrets'}
            </Button>
          </div>
          
          {error.all && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.all}</AlertDescription>
            </Alert>
          )}
          
          {allTurrets && allTurrets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTurrets.map((turret) => (
                <TurretCard key={turret.id} turret={turret} />
              ))}
            </div>
          )}
          
          {allTurrets && allTurrets.length === 0 && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>No turrets found</AlertTitle>
              <AlertDescription>No turrets are available in the database.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Search by Name Tab */}
        <TabsContent value="byName" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Search Turret by Name</h2>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Enter turret name (e.g., Laser)" 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTurretByName()}
                className="flex-1"
              />
              <Button 
                onClick={fetchTurretByName} 
                disabled={loading.single}
                variant="default"
              >
                {loading.single ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {error.single && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.single}</AlertDescription>
              </Alert>
            )}
            
            {singleTurret && (
              <div className="mt-4">
                <TurretCard turret={singleTurret} expanded />
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Search by Type Tab */}
        <TabsContent value="byType" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Search Turrets by Type</h2>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Enter turret type (e.g., Energy, Kinetic)" 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTurretsByType()}
                className="flex-1"
              />
              <Button 
                onClick={fetchTurretsByType} 
                disabled={loading.type}
                variant="default"
              >
                {loading.type ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {error.type && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.type}</AlertDescription>
              </Alert>
            )}
            
            {turretsByType && turretsByType.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {turretsByType.map((turret) => (
                  <TurretCard key={turret.id} turret={turret} />
                ))}
              </div>
            )}
            
            {turretsByType && turretsByType.length === 0 && (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>No turrets found</AlertTitle>
                <AlertDescription>No turrets of type "{searchType}" were found.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable card component for displaying turret data
function TurretCard({ turret, expanded = false }: { turret: TurretData, expanded?: boolean }) {
  return (
    <Card className={expanded ? "w-full" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{turret.name}</CardTitle>
          <div className="flex gap-2">
            {turret.tier && <Badge variant="outline">{turret.tier}</Badge>}
            <Badge>{turret.type}</Badge>
          </div>
        </div>
        <CardDescription>ID: {turret.id}</CardDescription>
      </CardHeader>
      <CardContent>
        {turret.description && (
          <p className="mb-4 text-muted-foreground">{turret.description}</p>
        )}
        
        {turret.stats && (
          <div className="space-y-2">
            <h4 className="font-semibold">Stats:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span>Power:</span>
                <span className="font-medium">{turret.stats.power}</span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span className="font-medium">{turret.stats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span>Range:</span>
                <span className="font-medium">{turret.stats.range}</span>
              </div>
              <div className="flex justify-between">
                <span>Fire Rate:</span>
                <span className="font-medium">{turret.stats.fireRate}</span>
              </div>
            </div>
          </div>
        )}
        
        {expanded && turret.abilities && turret.abilities.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Abilities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {turret.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {!expanded && (
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">View Details</Button>
        </CardFooter>
      )}
    </Card>
  );
}
