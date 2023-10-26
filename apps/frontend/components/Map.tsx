'use client';

import React, { useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -29.9363,
  lng: -50.9674,
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: 'pt-br',
  });

  const [map, setMap] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);

  useEffect(() => {
    if (isLoaded && map) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Coordenadas obtidas:', { latitude, longitude });

            setCurrentLocation({ lat: latitude, lng: longitude });

            if (map) {
              map.setCenter({ lat: latitude, lng: longitude });
            }
          },
          (error) => {
            console.error('Erro ao obter a localização do usuário:', error);
          },
          {
            enableHighAccuracy: true, // Tenta obter a melhor precisão possível
            timeout: 10000, // Tempo limite de 10 segundos
            maximumAge: 0, // Não use uma posição em cache
          },
        );
      } else {
        console.error('Geolocalização não suportada pelo navegador.');
      }
    }
  }, [isLoaded, map]);

  const onLoad = React.useCallback(function callback(map: any) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      zoom={13}
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
