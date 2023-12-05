'use client';

import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Libraries,
  LoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertDirectionsResponseToDirectionsResult } from '../../../utils/convert';
import toast from 'react-hot-toast';
import Trips from './TripList';
import { errorControl } from '../../../utils/warnings';

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

export default function Map({ trip_id }: any) {
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // prettier-ignore
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [points, setPoints] = useState<any>(null);

  // Pegando as informações iniciais
  const getInfo = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/map/path/${trip_id}`);

      if (data.error === false) {
        setDirectionsResponse(
          // @ts-ignore
          convertDirectionsResponseToDirectionsResult(data.path),
        );
        setPoints(data.points);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setPoints, setDirectionsResponse]);

  // Atualização Inicial da lista
  useEffect(() => {
    getInfo();
  }, []);

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
            {/* Desenhando Rota */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  suppressMarkers: true,
                }}
              />
            )}
            {/* Ponto Inicial */}
            {points && !points.start.started && (
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
            {points && (
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
            {/* Waypoints */}
            {points &&
              points.waypoints.map((waypoint: any, index: any) => {
                return (
                  <Marker
                    key={waypoint.id}
                    position={waypoint.location as Location}
                    icon={{
                      url: index === 0 ? '/student_next.png' : '/student.png',
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    label={{
                      text: `${index + 1}`,
                      className: 'map-label',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                    onClick={() => setSelectedMarker(waypoint)}
                  />
                );
              })}

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
        <Trips trip_id={trip_id} />
      </div>
    </div>
  );
}
