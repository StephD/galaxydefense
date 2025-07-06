import type { Plugin } from 'vite';
import { parse } from 'url';
import { gameData } from './data';
import { getAllTurrets, getTurretByName, getTurretsByType } from '../lib/turretService';

// Set security headers for all API responses
const setSecurityHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  // Don't set Content-Type here, we'll set it just before sending the response
};

// Handle API errors consistently
const handleApiError = (res: any, error: any, statusCode = 500) => {
  console.error('API error:', error);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 
    error: error.message || 'Internal server error',
    status: statusCode 
  }));
};

// Define the API middleware
export function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        
        // Skip non-API requests
        if (!url.startsWith('/api/')) {
          return next();
        }
        
        // Set security headers for all API responses
        setSecurityHeaders(res);
        
        // Only allow GET requests
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        
        try {
          // Parse the URL to get query parameters for all endpoints
          const parsedUrl = parse(url, true);
          const pathname = parsedUrl.pathname || '';
          
          // Legacy data endpoint
          if (pathname === '/api/data') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(gameData));
            return;
          }
          
          // Single turret by name endpoint (/api/turret?name=X)
          if (pathname === '/api/turret') {
            const nameParam = parsedUrl.query.name as string;
            
            if (!nameParam) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Turret name is required as a query parameter: /api/turret?name=TurretName' }));
              return;
            }
            
            const decodedName = decodeURIComponent(nameParam);
            const turret = await getTurretByName(decodedName);
            
            if (!turret) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Turret '${decodedName}' not found` }));
              return;
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(turret));
            return;
          }
          
          // Turrets endpoint - either all turrets or filtered by type
          if (pathname === '/api/turrets') {
            const typeParam = parsedUrl.query.type as string;
            
            // If type parameter exists, filter by type
            if (typeParam) {
              const decodedType = decodeURIComponent(typeParam);
              const turrets = await getTurretsByType(decodedType);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(turrets));
              return;
            }
            
            // Otherwise return all turrets
            const turrets = await getAllTurrets();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(turrets));
            return;
          }
          
          // If we get here, the API endpoint was not found
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `API endpoint not found: ${url}` }));
        } catch (error) {
          handleApiError(res, error);
        }
      });
    }
  };
};
