'use client';

import {
  GoogleMap,
  Marker,
  Libraries,
  LoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Trips from './TripList';
import { errorControl } from '../../utils/warnings';

import { useSearchParams } from 'next/navigation';

// Gravataí
const center = { lat: -29.94377411359114, lng: -50.97560462754559 };

const libraries = [
  'drawing',
  'geometry',
  'localContext',
  'places',
  'visualization',
];

type Location = {
  lat: number;
  lng: number;
};

export default function Map() {
  const searchParams = useSearchParams();
  const student_id = searchParams.get('id');

  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [points, setPoints] = useState<any>(null);
  const [studentName, setStudentName] = useState<string | null>('');

  const getInfo = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/responsible/map/${student_id}`);

      if (data.error === false) {
        setPoints(data.result.points);
        setStudentName(data.result.student_name);
        setCurrentLocation(data.result.driver_location);
        if (data.result.driver_location !== null) {
          googleMap?.panTo(data.result.driver_location);
        }
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setPoints, setStudentName, setCurrentLocation]);

  // Atualização Inicial da lista
  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (currentLocation !== null) {
      const intervalId = setInterval(getInfo, 5000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentLocation]);

  return (
    <div className="relative h-full">
      <div className="h-full">
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          libraries={libraries as Libraries}
        >
          <GoogleMap
            onLoad={(map) => {
              setGoogleMap(map);
            }}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={13}
            center={center}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              clickableIcons: false,
              styles: [
                {
                  elementType: 'labels',
                  featureType: 'poi.business',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  elementType: 'labels',
                  featureType: 'poi.park',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  elementType: 'labels',
                  featureType: 'poi.place_of_worship',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  elementType: 'labels',
                  featureType: 'poi.attraction',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  elementType: 'labels',
                  featureType: 'poi.sports_complex',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            }}
          >
            {/* Carro */}
            {googleMap && currentLocation !== null && (
              <Marker
                position={currentLocation as Location}
                icon={{
                  path: 'M4.40619 23.4375C3.09369 24.4687 3.12494 24.1875 3.12494 36.9062C3.12494 48.375 3.12494 48.625 3.59369 49.1875C4.28119 50.0937 5.37494 50.2812 9.03119 50.2187L12.3124 50.1562L12.4999 49.1875C13.2187 44.8437 17.6562 41.5625 21.7499 42.3125C24.4687 42.8125 26.5312 44.375 27.8124 46.9063C28.2499 47.7813 28.5937 48.75 28.5937 49.0312C28.5937 50.3437 27.8749 50.25 39.8749 50.25H50.8437L50.9999 49.1562C51.3124 46.6562 53.3437 44.0938 55.9062 42.9062C58.6874 41.5938 61.9687 42.125 64.3437 44.2812C65.7812 45.5937 66.7499 47.25 67.0937 48.9375L67.3749 50.25H71.2187C75.4374 50.25 76.2187 50.0625 76.6249 48.9687C76.9999 47.9687 76.9062 36.4375 76.4999 34.5C75.9999 32.125 75.0624 29.1562 74.4062 27.8437C73.6249 26.3125 71.4999 23.7187 70.6874 23.2812C70.1249 23 66.0312 22.9375 37.4999 22.9375H4.99994L4.40619 23.4375ZM14.9687 31.375V36.1562H10.8749H6.78119V31.375V26.5937H10.8749H14.9687V31.375ZM26.3437 31.375V36.1562H22.2499H18.1562V31.375V26.5937H22.2499H26.3437V31.375ZM37.7187 31.375V36.1562H33.6249H29.5312V31.375V26.5937H33.6249H37.7187V31.375ZM49.0937 31.375V36.1562H44.9999H40.9062V31.375V26.5937H44.9999H49.0937V31.375ZM60.4687 31.375V36.1562H56.3749H52.2812V31.375V26.5937H56.3749H60.4687V31.375ZM67.9374 26.9375C70.1249 27.5937 71.3437 29.125 72.5312 32.6875C73.2187 34.7812 73.7499 37.5625 73.9999 40.4375L74.1562 42.0937H69.1249H64.0937V34.5C64.0937 28.625 64.1562 26.875 64.3749 26.7812C64.9999 26.5 66.8124 26.625 67.9374 26.9375Z M18.8436 44.25C16.0311 45 14.2811 47.2187 14.0936 50.1562C13.9999 51.5312 14.0624 51.9687 14.5624 53C15.3124 54.6562 16.0624 55.4687 17.5311 56.2812C18.5936 56.875 18.9686 56.9687 20.5624 56.9687C22.0936 56.9687 22.5624 56.8437 23.5311 56.3437C25.8124 55.1562 27.0311 53.0312 27.0311 50.375C27.0311 46.1875 22.9374 43.125 18.8436 44.25ZM22.1249 46.8125C25.2811 48.25 25.4686 52.5937 22.4686 54.125C19.7186 55.5312 16.5624 53.5937 16.5624 50.5C16.5624 48.6875 17.3749 47.4687 19.0624 46.75C20.1249 46.3125 21.0311 46.3125 22.1249 46.8125Z M57.6874 44.125C56.2812 44.4688 55.1249 45.1563 54.1249 46.2813C50.6562 50.25 53.1562 56.4688 58.5312 57C64.3437 57.5938 67.8124 50.5 63.9374 46.0625C62.5312 44.5313 59.7187 43.625 57.6874 44.125ZM61.2812 47.0625C63.9062 48.6875 63.6562 52.7188 60.9062 54.125C58.1874 55.5 54.9999 53.5625 54.9999 50.4688C54.9999 49.4375 55.5937 48.0938 56.3124 47.4375C57.5624 46.3438 59.8124 46.1875 61.2812 47.0625Z',
                  fillColor: '#e8c70e',
                  fillOpacity: 1,
                  strokeWeight: 1.1,
                  rotation: 0,
                  scale: 0.6,
                  anchor: new google.maps.Point(42, 42),
                }}
                options={{ map: googleMap }}
              />
            )}
            {/* Ponto Inicial */}
            {points && points.start !== null && (
              <Marker
                position={points.start.location as Location}
                icon={{
                  url: '/marker_start.png',
                  anchor: new google.maps.Point(8, 40),
                  scaledSize: new google.maps.Size(40, 40),
                }}
                onClick={() => setSelectedMarker(points.start)}
              />
            )}

            {/* Ponto Final */}
            {points && points.end !== null && (
              <Marker
                position={points.end.location as Location}
                icon={{
                  url: '/marker_end.png',
                  anchor: new google.maps.Point(8, 40),
                  scaledSize: new google.maps.Size(40, 40),
                }}
                onClick={() => setSelectedMarker(points.end)}
              />
            )}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h2 className="font-bold">{selectedMarker.title}</h2>
                  <p>{selectedMarker.address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      <div>
        <Trips student_name={studentName} />
      </div>
    </div>
  );
}
