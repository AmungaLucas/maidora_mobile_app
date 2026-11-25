import * as Location from 'expo-location';

// Requests foreground-only location access. No background tracking is used.
export async function detectCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    return { permissionGranted: false, latitude: null, longitude: null, county: '', town: '', area: '', source: 'manual' };
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = position.coords;
  let address = {};
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    address = results?.[0] || {};
  } catch (error) {
    // Coordinates are still useful; let the user fill readable address fields manually.
  }

  return {
    permissionGranted: true,
    latitude,
    longitude,
    county: address.subregion || address.region || '',
    town: address.city || address.district || address.subregion || '',
    area: address.district || address.street || address.name || '',
    source: 'gps',
  };
}

export async function getLatestDeviceLocation() {
  const permission = await Location.getForegroundPermissionsAsync();
  if (permission.status !== 'granted') return null;
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: position.coords.latitude, longitude: position.coords.longitude, capturedAt: new Date().toISOString() };
}