export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface Location {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
  country?: string;
  region?: string;
  timezone?: string;
}

export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  const R = 6371;
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.latitude * Math.PI) / 180) *
      Math.cos((point2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};

export const parseCoordinates = (str: string): Coordinates | null => {
  const parts = str.split(",").map((p) => p.trim());
  if (parts.length < 2) return null;

  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return { latitude: lat, longitude: lon };
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const watchLocation = (
  callback: (coords: Coordinates) => void,
  errorCallback?: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported");
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude || undefined,
      });
    },
    errorCallback
  );
};

export const stopWatchingLocation = (watchId: number): void => {
  navigator.geolocation.clearWatch(watchId);
};

export const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
};

export const getBoundingBox = (
  locations: Location[]
): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null => {
  if (locations.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  locations.forEach((location) => {
    const { latitude, longitude } = location.coordinates;
    north = Math.max(north, latitude);
    south = Math.min(south, latitude);
    east = Math.max(east, longitude);
    west = Math.min(west, longitude);
  });

  return { north, south, east, west };
};

export const findNearestLocation = (
  target: Coordinates,
  locations: Location[]
): Location | null => {
  if (locations.length === 0) return null;

  let nearest: Location | null = null;
  let minDistance = Infinity;

  locations.forEach((location) => {
    const distance = calculateDistance(target, location.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  });

  return nearest;
};

export const getLocationsWithinRadius = (
  center: Coordinates,
  radiusKm: number,
  locations: Location[]
): Location[] => {
  return locations.filter((location) => {
    const distance = calculateDistance(center, location.coordinates);
    return distance <= radiusKm;
  });
};

