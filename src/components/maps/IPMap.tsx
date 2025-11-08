'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface IPMapProps {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export default function IPMap({ lat, lon, city, country }: IPMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create new map
    const map = L.map(mapRef.current).setView([lat, lon], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      html: `
        <div style="
          background: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      `,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add marker
    const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
    
    // Add popup
    marker.bindPopup(`
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937;">${city}</h3>
        <p style="margin: 0; color: #6b7280;">${country}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">
          ${lat.toFixed(4)}, ${lon.toFixed(4)}
        </p>
      </div>
    `).openPopup();

    // Add circle to show approximate area
    L.circle([lat, lon], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: 5000
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, city, country]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
