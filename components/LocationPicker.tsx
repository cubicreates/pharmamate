import React, { useState, useEffect } from 'react';
import { reverseGeocode, getCurrentLocation } from '@/lib/utils/api';

interface Location {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect: (data: { address: string; location: Location | null; components?: Record<string, unknown> }) => void;
  onLocationError?: (msg: string) => void;
  initialAddress?: string;
  showMap?: boolean;
}

const LocationPicker = ({
  onLocationSelect,
  onLocationError,
  initialAddress = '',
}: LocationPickerProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState<Location | null>(null);
  const [error, setError] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const detectLocation = async () => {
    setIsDetecting(true);
    setError('');
    setShowManualInput(false);

    try {
      const location = (await getCurrentLocation()) as Location & { accuracy: number };
      setCoordinates({ lat: location.lat, lng: location.lng });
      setAccuracy(location.accuracy);

      const geocodedData = (await reverseGeocode(location.lat, location.lng)) as {
        success: boolean;
        address: string;
        location: Location;
        components?: Record<string, unknown>;
      };

      if (geocodedData.success) {
        setAddress(geocodedData.address);

        // Send final result to parent (ONE TIME)
        onLocationSelect({
          address: geocodedData.address,
          location: geocodedData.location,
          components: geocodedData.components || {}
        });

      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown location error';
      setError(message);
      onLocationError?.(message);

      setShowManualInput(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) return;

    // Send result ONLY when user confirms
    onLocationSelect({
      address: address,
      location: coordinates || null,
      components: {}
    });
  };

  useEffect(() => {
    if (!initialAddress) {
      detectLocation();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
          Store Location
        </label>

        <div className="mb-4">
          <button
            type="button"
            onClick={detectLocation}
            disabled={isDetecting}
            className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isDetecting
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-wait'
              : 'bg-primary text-white hover:bg-slate-700'
              }`}
          >
            {isDetecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Detecting Your Location...
              </>
            ) : (
              <>
                <span className="text-xl">📍</span>
                Use My Current Location
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            We'll use your device's GPS to find your exact store location
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            <p className="text-red-500 dark:text-red-300 text-xs mt-1">
              Please enable location access or enter address manually.
            </p>
          </div>
        )}

        {coordinates && accuracy && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
              <div>
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                  Location detected successfully!
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                  Accuracy: within {Math.round(accuracy)} meters
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address display */}
      <div>
        <label className="block text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
          Store Address
        </label>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            {address || 'No address detected'}
          </p>

          {coordinates && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-sm text-accent font-medium hover:underline"
          >
            {showManualInput ? 'Hide Manual Entry' : 'Edit Address Manually'}
          </button>

          <button
            type="button"
            onClick={detectLocation}
            disabled={isDetecting}
            className="text-sm text-primary dark:text-gray-300 font-medium hover:underline"
          >
            Redetect Location
          </button>
        </div>
      </div>

      {/* Manual input */}
      {showManualInput && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-bold text-primary dark:text-white mb-3">
            Enter Address Manually
          </h4>

          <form onSubmit={handleManualAddressSubmit} className="space-y-3">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete store address..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-dark dark:text-white text-sm"
              rows={3}
              required
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!address.trim()}
                className="flex-1 bg-accent text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use This Address
              </button>

              <button
                type="button"
                onClick={() => setShowManualInput(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
