
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Map, Loader, AlertTriangle, Navigation, LocateFixed, Shield, Hospital, Phone, ArrowRight, School, Store, Coffee } from 'lucide-react';
import { API_BASE_URL } from './apiConfig';

// Cache for storing location data
const locationCache = {
  coords: null,
  timestamp: null,
  services: null,
  pois: null,
  CACHE_EXPIRY: 5 * 60 * 1000 // 5 minutes
};

// Custom styles
const styles = `
  .pulse-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pulse-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    transform: scale(1);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
  .modern-map {
    border-radius: 0.5rem;
  }
  .modern-popup {
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  .map-legend {
    position: absolute;
    bottom: 15px;
    right: 5px;
    z-index: 1000;
    background: white;
    padding: 6px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    max-width: 150px;
    font-size: 11px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }
  .legend-color {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    border-radius: 50%;
  }
  .poi-filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
    justify-content: center;
  }
  .poi-filter-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 6px !important;
  }
  .leaflet-popup-content {
    margin: 8px 10px;
    line-height: 1.3;
    font-size: 13px;
  }
  @media (min-width: 640px) {
    .map-legend {
      bottom: 20px;
      right: 10px;
      padding: 8px;
      max-width: 180px;
      font-size: 12px;
    }
    .legend-item {
      margin-bottom: 4px;
    }
    .poi-filter-button {
      padding: 6px 10px;
      font-size: 13px;
    }
  }
`;

// Routing Machine Component
const RoutingMachine = ({ startPoint, endPoint, color }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ],
      lineOptions: {
        styles: [{
          color,
          weight: 4,
          opacity: 0.8,
          dashArray: '0',
          lineCap: 'round'
        }]
      },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, color]);

  useEffect(() => {
    if (routingControlRef.current && startPoint && endPoint) {
      routingControlRef.current.setWaypoints([
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ]);
    }
  }, [startPoint, endPoint]);

  return null;
};

// Custom icons
const createPulseIcon = (color) => {
  return L.divIcon({
    className: 'pulse-icon',
    iconSize: [18, 18],
    html: `<div class="pulse-dot" style="background-color: ${color}"></div>`
  });
};

const createSvgIcon = (type) => {
  let svgContent = '';
  let size = [28, 28];
  let anchor = [14, 14];
  
  switch(type) {
    case 'police':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e40af" width="28" height="28">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
          <path d="M12 4l1.5 4.5h5l-4 3 1.5 4.5-4-3-4 3 1.5-4.5-4-3h5z" fill="white"/>
        </svg>
      `;
      size = [32, 32];
      anchor = [16, 16];
      break;
    case 'hospital':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#047857" width="28" height="28">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#10b981"/>
          <rect x="7" y="10" width="10" height="4" fill="white"/>
          <rect x="10" y="7" width="4" height="10" fill="white"/>
        </svg>
      `;
      size = [32, 32];
      anchor = [16, 16];
      break;
    case 'school':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6366f1" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#818cf8"/>
          <path d="M12 6l-7 4v2h2v4h10v-4h2v-2l-7-4z" fill="white"/>
          <rect x="10" y="13" width="4" height="3" fill="#818cf8"/>
        </svg>
      `;
      break;
    case 'shop':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d97706" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
          <path d="M6 9h12v8H6z" fill="white"/>
          <path d="M7 7h10l1 2H6z" fill="white"/>
        </svg>
      `;
      break;
    case 'restaurant':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#b91c1c" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#ef4444"/>
          <path d="M9 6v9c0 0.552-0.448 1-1 1s-1-0.448-1-1V6h2zm5 0v9c0 0.552-0.448 1-1 1s-1-0.448-1-1V6h2zm3 1v4c0 2.209-1.791 4-4 4v3.5c0 0.552-0.448 1-1 1s-1-0.448-1-1V15c-2.209 0-4-1.791-4-4V7h10z" fill="white"/>
        </svg>
      `;
      break;
    default:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b7280" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="white"/>
          <circle cx="12" cy="12" r="10" fill="#9ca3af"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `;
  }
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: svgContent,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -14]
  });
};

const MapViewController = ({ userLocation, hasRouteActive }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation && !hasRouteActive) {
      map.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    }
  }, [map, userLocation, hasRouteActive]);
  
  return null;
};

const POIFinder = ({ userLocation, poiCategory, setFoundPOIs }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!userLocation || !poiCategory) return;
    
    const fetchPOIs = async () => {
      try {
        const cacheKey = `${poiCategory}-${userLocation.lat.toFixed(4)}-${userLocation.lng.toFixed(4)}`;
        if (locationCache.pois && locationCache.pois[cacheKey] && isCacheValid()) {
          setFoundPOIs(locationCache.pois[cacheKey]);
          return;
        }
        
        let query = '';
        const radius = 1000;
        
        switch(poiCategory) {
          case 'schools':
            query = `[out:json];(node["amenity"="school"](around:${radius},${userLocation.lat},${userLocation.lng});way["amenity"="school"](around:${radius},${userLocation.lat},${userLocation.lng}););out center;`;
            break;
          case 'shops':
            query = `[out:json];(node["shop"](around:${radius},${userLocation.lat},${userLocation.lng});way["shop"](around:${radius},${userLocation.lat},${userLocation.lng}););out center;`;
            break;
          case 'restaurants':
            query = `[out:json];(node["amenity"="restaurant"](around:${radius},${userLocation.lat},${userLocation.lng});node["amenity"="cafe"](around:${radius},${userLocation.lat},${userLocation.lng});way["amenity"="restaurant"](around:${radius},${userLocation.lat},${userLocation.lng}););out center;`;
            break;
          default:
            return;
        }
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });
        
        const data = await response.json();
        const pois = data.elements.map(element => {
          let lat, lng;
          
          if (element.type === 'node') {
            lat = element.lat;
            lng = element.lon;
          } else if (element.center) {
            lat = element.center.lat;
            lng = element.center.lon;
          } else {
            return null;
          }
          
          const distance = L.latLng(userLocation.lat, userLocation.lng)
            .distanceTo(L.latLng(lat, lng));
            
          return {
            id: element.id,
            name: element.tags?.name || 
                 (poiCategory === 'schools' ? 'School' : 
                  poiCategory === 'shops' ? 'Shop' : 'Restaurant'),
            lat,
            lng,
            type: poiCategory === 'schools' ? 'school' : 
                  poiCategory === 'shops' ? 'shop' : 'restaurant',
            distance,
            address: element.tags?.["addr:street"] ? 
                    `${element.tags?.["addr:housenumber"] || ''} ${element.tags?.["addr:street"] || ''}`.trim() : 
                    null,
            tags: element.tags
          };
        }).filter(poi => poi !== null);
        
        pois.sort((a, b) => a.distance - b.distance);
        
        if (!locationCache.pois) {
          locationCache.pois = {};
        }
        locationCache.pois[cacheKey] = pois;
        locationCache.timestamp = Date.now();
        
        setFoundPOIs(pois);
      } catch (error) {
        console.error("Error fetching POIs:", error);
        setFoundPOIs([]);
      }
    };
    
    fetchPOIs();
  }, [userLocation, poiCategory, setFoundPOIs]);
  
  return null;
};

const isCacheValid = () => {
  if (!locationCache.timestamp) return false;
  return (Date.now() - locationCache.timestamp) < locationCache.CACHE_EXPIRY;
};

const formatDistance = (meters) => {
  if (!meters) return 'N/A';
  return meters < 1000 
    ? `${Math.round(meters)}m` 
    : `${(meters/1000).toFixed(1)}km`;
};

const formatPhone = (phone) => {
  if (!phone) return null;
  return phone;
};

const ReportResponse = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestServices, setNearestServices] = useState({ police: null, hospital: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [isFetchingServices, setIsFetchingServices] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [activePOIFilter, setActivePOIFilter] = useState(null);
  const [foundPOIs, setFoundPOIs] = useState([]);
  const watchIdRef = useRef(null);
  const permissionDenied = useRef(false);

  const icons = {
    police: createSvgIcon('police'),
    hospital: createSvgIcon('hospital'),
    school: createSvgIcon('school'),
    shop: createSvgIcon('shop'),
    restaurant: createSvgIcon('restaurant')
  };

  const fetchNearestServices = useCallback(async (lat, lng) => {
    setIsFetchingServices(true);
    
    if (locationCache.services && 
        locationCache.coords?.lat === lat && 
        locationCache.coords?.lng === lng &&
        isCacheValid()) {
      setNearestServices(locationCache.services);
      setIsFetchingServices(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/nearest-services?lat=${lat}&lng=${lng}`
      );
      
      const data = await response.json();
      
      locationCache.coords = { lat, lng };
      locationCache.services = data;
      locationCache.timestamp = Date.now();
      
      setNearestServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load service data");
      
      if (locationCache.services) {
        setNearestServices(locationCache.services);
      }
    } finally {
      setIsFetchingServices(false);
    }
  }, []);

  const stopWatchingPosition = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if (!locationGranted) {
      setLocationGranted(false);
    }
    
    setActiveRoute(null);
    setActivePOIFilter(null);
    setFoundPOIs([]);
    
    if (permissionDenied.current) {
      setError("Location access denied. Please enable permissions in your browser settings.");
      setLoading(false);
      return;
    }
    
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation");
      setLoading(false);
      return;
    }

    stopWatchingPosition();

    if (locationCache.coords && isCacheValid()) {
      setUserLocation(locationCache.coords);
      if (locationCache.services) {
        setNearestServices(locationCache.services);
      } else {
        fetchNearestServices(locationCache.coords.lat, locationCache.coords.lng);
      }
      setLocationGranted(true);
      setLoading(false);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearestServices(latitude, longitude);
          setupPositionWatcher(latitude, longitude);
        },
        (err) => handleLocationError(err, true),
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
      
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationGranted(true);
        await fetchNearestServices(latitude, longitude);
        setLoading(false);

        setupPositionWatcher(latitude, longitude);
      },
      (err) => handleLocationError(err),
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }, [fetchNearestServices, locationGranted, stopWatchingPosition]);

  const handleLocationError = useCallback((err, silent = false) => {
    console.error("Location error:", err);
    
    if (!silent) {
      if (err.code === 1) {
        permissionDenied.current = true;
        setError("Location access denied. Please enable permissions in your browser settings.");
      } else if (err.code === 2) {
        setError("Your location couldn't be determined. Please check your device's location settings.");
      } else if (err.code === 3) {
        setError("Location request timed out. Please try again.");
      } else {
        setError("Couldn't determine your location");
      }
      setLoading(false);
    }
  }, []);

  const setupPositionWatcher = useCallback((initialLat, initialLng) => {
    if (permissionDenied.current) return;
    
    if (!locationCache.coords) {
      locationCache.coords = { lat: initialLat, lng: initialLng };
      locationCache.timestamp = Date.now();
    }
    
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newLocation = { lat: latitude, lng: longitude };
          
          locationCache.coords = newLocation;
          locationCache.timestamp = Date.now();
          
          if (userLocation) {
            const distance = L.latLng(userLocation.lat, userLocation.lng)
              .distanceTo(L.latLng(latitude, longitude));
            
            if (distance > 50) {
              setUserLocation(newLocation);
              
              if (distance > 500) {
                fetchNearestServices(latitude, longitude);
                if (activePOIFilter) {
                  setFoundPOIs([]);
                  setActivePOIFilter(prevFilter => {
                    const currentFilter = prevFilter;
                    setActivePOIFilter(null);
                    setTimeout(() => setActivePOIFilter(currentFilter), 100);
                    return currentFilter;
                  });
                }
              }
            }
          } else {
            setUserLocation(newLocation);
          }
        },
        (err) => {
          console.error("Watch position error:", err);
          if (err.code === 1) {
            permissionDenied.current = true;
            stopWatchingPosition();
          }
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 30000,
          timeout: 27000
        }
      );
    } catch (e) {
      console.error("Error setting up position watcher:", e);
    }
  }, [fetchNearestServices, userLocation, stopWatchingPosition]);

  const handleGoClick = (serviceType) => {
    setActiveRoute(activeRoute === serviceType ? null : serviceType);
    if (activePOIFilter && activeRoute !== serviceType) {
      setActivePOIFilter(null);
    }
  };

  const handlePOIFilterClick = (filterType) => {
    if (activePOIFilter === filterType) {
      setActivePOIFilter(null);
      setFoundPOIs([]);
    } else {
      setActivePOIFilter(filterType);
      setFoundPOIs([]);
    }
  };

  useEffect(() => {
    return () => {
      stopWatchingPosition();
    };
  }, [stopWatchingPosition]);

  useEffect(() => {
    requestLocation();
    
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            permissionDenied.current = false;
            requestLocation();
          } else if (permissionStatus.state === 'denied') {
            permissionDenied.current = true;
            setError("Location access denied. Please enable permissions in your browser settings.");
          }
        };
      }).catch(e => {
        console.error("Permission query error:", e);
      });
    }
  }, [requestLocation]);

  const renderLocationError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center my-4 text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-red-700 mb-3 text-sm sm:text-base">{error}</p>
      <button 
        onClick={requestLocation}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 sm:py-2 sm:px-6 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"
      >
        <LocateFixed className="w-4 h-4" />
        {error?.includes("denied") ? "Enable Location" : "Retry Location"}
      </button>
      
      {error?.includes("denied") && (
        <div className="mt-3 text-xs sm:text-sm text-gray-600 max-w-md">
          <p>To enable location:</p>
          <ul className="list-disc pl-5 mt-1 text-left">
            <li>Click the lock/info icon in your browser's address bar</li>
            <li>Find "Location" permissions and set to "Allow"</li>
            <li>Refresh this page after changing settings</li>
          </ul>
        </div>
      )}
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-gray-600">
      <Loader className="w-8 h-8 animate-spin mb-3 text-blue-600" />
      <p className="text-sm sm:text-base">Detecting your location...</p>
    </div>
  );

  const renderPOIFilters = () => (
    <div className="poi-filter-container">
      <button 
        className={`poi-filter-button ${activePOIFilter === 'schools' ? 'active' : ''}`}
        onClick={() => handlePOIFilterClick('schools')}
      >
        <School className="w-3 h-3 sm:w-4 sm:h-4" />
        Schools
      </button>
      <button 
        className={`poi-filter-button ${activePOIFilter === 'shops' ? 'active' : ''}`}
        onClick={() => handlePOIFilterClick('shops')}
      >
        <Store className="w-3 h-3 sm:w-4 sm:h-4" />
        Shops
      </button>
      <button 
        className={`poi-filter-button ${activePOIFilter === 'restaurants' ? 'active' : ''}`}
        onClick={() => handlePOIFilterClick('restaurants')}
      >
        <Coffee className="w-3 h-3 sm:w-4 sm:h-4" />
        Restaurants
      </button>
    </div>
  );

  const renderPOIPoints = () => {
    if (!foundPOIs || foundPOIs.length === 0) return null;
    
    return foundPOIs.map(poi => (
      <Marker 
        key={`${poi.type}-${poi.id}`}
        position={[poi.lat, poi.lng]} 
        icon={icons[poi.type]}
      >
        <Popup className="modern-popup">
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="block" style={{ 
              color: poi.type === 'school' ? '#6366f1' : 
                     poi.type === 'shop' ? '#d97706' : '#b91c1c' 
            }}>
              {poi.name}
            </strong>
            {poi.address && <p>{poi.address}</p>}
            <div className="flex items-center gap-1 text-gray-600">
              <Navigation className="w-3 h-3" />
              <span>{formatDistance(poi.distance)} away</span>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  };

  const renderServiceCards = () => {
    if (!nearestServices || (!nearestServices.police && !nearestServices.hospital)) {
      return (
        <div className="text-center py-3 text-gray-600 text-sm sm:text-base">
          {isFetchingServices ? (
            <div className="flex flex-col items-center">
              <Loader className="w-5 h-5 animate-spin mb-1 sm:mb-2" />
              <p>Finding nearest emergency services...</p>
            </div>
          ) : (
            <p>No emergency services found in your area.</p>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {nearestServices.police && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-blue-100">
            <div className="bg-blue-50 p-3 flex items-center gap-2">
              <Shield className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-sm sm:text-base font-medium text-blue-800">Police Station</h3>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1">{nearestServices.police.name}</h4>
              {nearestServices.police.address && (
                <p className="text-gray-600 text-xs sm:text-sm mb-2">{nearestServices.police.address}</p>
              )}
              <div className="flex flex-col gap-1 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDistance(nearestServices.police.distance)} away</span>
                </div>
                {nearestServices.police.phone && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <a 
                      href={`tel:${formatPhone(nearestServices.police.phone)}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {formatPhone(nearestServices.police.phone)}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleGoClick('police')}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium
                    ${activeRoute === 'police' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-blue-700 hover:bg-gray-200'}
                    transition-colors
                  `}
                >
                  {activeRoute === 'police' ? 'Hide Route' : 'Show Route'}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {nearestServices.hospital && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-green-100">
            <div className="bg-green-50 p-3 flex items-center gap-2">
              <Hospital className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-sm sm:text-base font-medium text-green-800">Hospital / Medical</h3>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1">{nearestServices.hospital.name}</h4>
              {nearestServices.hospital.address && (
                <p className="text-gray-600 text-xs sm:text-sm mb-2">{nearestServices.hospital.address}</p>
              )}
              <div className="flex flex-col gap-1 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDistance(nearestServices.hospital.distance)} away</span>
                </div>
                {nearestServices.hospital.phone && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <a 
                      href={`tel:${formatPhone(nearestServices.hospital.phone)}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {formatPhone(nearestServices.hospital.phone)}
                    </a>
                  </div>
                )}
                {nearestServices.hospital.emergency && (
                  <div className="text-red-600 font-medium mt-1 text-xs sm:text-sm">
                    24/7 Emergency Room
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleGoClick('hospital')}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium
                    ${activeRoute === 'hospital' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-green-700 hover:bg-gray-200'}
                    transition-colors
                  `}
                >
                  {activeRoute === 'hospital' ? 'Hide Route' : 'Show Route'}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <style>{styles}</style>
      
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Map className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Safety Locator</h1>
      </div>

      {!locationGranted && renderLocationError()}
      
      {loading ? renderLoadingState() : (
        <div>
          {error ? renderLocationError() : (
            <>
              <div className="h-80 sm:h-96 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4 sm:mb-6">
                {userLocation && (
                  <MapContainer 
                    center={[userLocation.lat, userLocation.lng]} 
                    zoom={15} 
                    className="h-full w-full modern-map"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <Marker 
                      position={[userLocation.lat, userLocation.lng]} 
                      icon={createPulseIcon('#3b82f6')}
                    >
                      <Popup className="modern-popup">
                        <div className="text-xs sm:text-sm">
                          <strong className="text-blue-600 block mb-1">Your Location</strong>
                          <p className="text-gray-600">
                            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                    
                    <Circle 
                      center={[userLocation.lat, userLocation.lng]}
                      radius={100}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.1,
                        weight: 1
                      }}
                    />
                    
                    {nearestServices?.police && (
                      <Marker 
                        position={[nearestServices.police.lat, nearestServices.police.lng]} 
                        icon={icons.police}
                      >
                        <Popup className="modern-popup">
                          <div className="text-xs sm:text-sm space-y-1">
                            <strong className="text-blue-600 block">{nearestServices.police.name}</strong>
                            {nearestServices.police.address && <p>{nearestServices.police.address}</p>}
                            <div className="flex items-center gap-1 text-gray-600">
                              <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDistance(nearestServices.police.distance)} away</span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {nearestServices?.hospital && (
                      <Marker 
                        position={[nearestServices.hospital.lat, nearestServices.hospital.lng]} 
                        icon={icons.hospital}
                      >
                        <Popup className="modern-popup">
                          <div className="text-xs sm:text-sm space-y-1">
                            <strong className="text-green-600 block">{nearestServices.hospital.name}</strong>
                            {nearestServices.hospital.address && <p>{nearestServices.hospital.address}</p>}
                            <div className="flex items-center gap-1 text-gray-600">
                              <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDistance(nearestServices.hospital.distance)} away</span>
                            </div>
                            {nearestServices.hospital.emergency && (
                              <div className="text-red-600 font-medium text-xs sm:text-sm">24/7 Emergency Room</div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {renderPOIPoints()}
                    
                    {activeRoute === 'police' && nearestServices?.police && (
                      <RoutingMachine 
                        startPoint={userLocation} 
                        endPoint={{
                          lat: nearestServices.police.lat,
                          lng: nearestServices.police.lng
                        }}
                        color="#3b82f6"
                      />
                    )}
                    
                    {activeRoute === 'hospital' && nearestServices?.hospital && (
                      <RoutingMachine 
                        startPoint={userLocation} 
                        endPoint={{
                          lat: nearestServices.hospital.lat,
                          lng: nearestServices.hospital.lng
                        }}
                        color="#10b981"
                      />
                    )}
                    
                    <MapViewController 
                      userLocation={userLocation} 
                      hasRouteActive={!!activeRoute}
                    />
                    
                    {activePOIFilter && (
                      <POIFinder
                        userLocation={userLocation}
                        poiCategory={activePOIFilter}
                        setFoundPOIs={setFoundPOIs}
                      />
                    )}
                    
                    <div className="map-legend">
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                        <span>Your Location</span>
                      </div>
                      {nearestServices?.police && (
                        <div className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: '#1e40af' }}></div>
                          <span>Police</span>
                        </div>
                      )}
                      {nearestServices?.hospital && (
                        <div className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                          <span>Hospital</span>
                        </div>
                      )}
                      {activePOIFilter === 'schools' && foundPOIs.length > 0 && (
                        <div className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: '#818cf8' }}></div>
                          <span>Schools</span>
                        </div>
                      )}
                      {activePOIFilter === 'shops' && foundPOIs.length > 0 && (
                        <div className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                          <span>Shops</span>
                        </div>
                      )}
                      {activePOIFilter === 'restaurants' && foundPOIs.length > 0 && (
                        <div className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                          <span>Restaurants</span>
                        </div>
                      )}
                    </div>
                  </MapContainer>
                )}
              </div>
              
              {userLocation && renderPOIFilters()}
              
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Nearest Emergency Services
              </h2>
              {renderServiceCards()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportResponse;