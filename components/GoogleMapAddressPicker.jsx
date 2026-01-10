'use client';

import { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { MapPin, Loader2 } from 'lucide-react';

const libraries = ['places'];

const GoogleMapAddressPicker = ({ 
  value, 
  onChange, 
  placeholder = 'Enter your address',
  label = 'Address',
  required = false,
  onPlaceSelect 
}) => {
  const [address, setAddress] = useState(value || '');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (value !== address) {
      setAddress(value || '');
    }
  }, [value]);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'in' }, // Restrict to India
          fields: ['formatted_address', 'geometry', 'address_components', 'name', 'place_id'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place.geometry) {
          const formattedAddress = place.formatted_address || place.name || '';
          setAddress(formattedAddress);
          setSelectedPlace({
            formatted_address: formattedAddress,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            place_id: place.place_id,
            address_components: place.address_components,
          });

          // Call onChange with the full address
          if (onChange) {
            onChange({
              target: {
                name: 'address',
                value: formattedAddress,
              },
            });
          }

          // Call onPlaceSelect with place details
          if (onPlaceSelect) {
            onPlaceSelect({
              formatted_address: formattedAddress,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              place_id: place.place_id,
              address_components: place.address_components,
            });
          }
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  if (loadError) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            ref={inputRef}
            value={address}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={3}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required={required}
          />
          <p className="text-xs text-red-500 mt-1">
            Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
          <textarea
            value={address}
            onChange={handleInputChange}
            placeholder="Loading Google Maps..."
            rows={3}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
            disabled
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">(Start typing to search)</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <textarea
          ref={inputRef}
          value={address}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={3}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          required={required}
        />
      </div>
      {selectedPlace && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700">
            <strong>Selected:</strong> {selectedPlace.formatted_address}
          </p>
          {selectedPlace.lat && selectedPlace.lng && (
            <p className="text-xs text-green-600 mt-1">
              Coordinates: {selectedPlace.lat.toFixed(6)}, {selectedPlace.lng.toFixed(6)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleMapAddressPicker;

