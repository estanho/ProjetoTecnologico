'use client';

import { FormEvent } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function NewRoutePage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: 'pt-br',
  });

  async function searchPlaces(event: FormEvent) {
    event.preventDefault();
    const source = document.querySelector<HTMLInputElement>(
      'input[name=source_place',
    )?.value;
    const destination = document.querySelector<HTMLInputElement>(
      'input[name=destination_place',
    )?.value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3001/places?text=${source}`),
      fetch(`http://localhost:3001/places?text=${destination}`),
    ]);
  }

  const position = { lat: -29.9416968512721, lng: -50.9727555392349 };

  return (
    <div className="flex flex-row h-full">
      <div>
        <h1>Nova Rota</h1>
        <form className="flex flex-col" onSubmit={searchPlaces}>
          <input name="source_place" placeholder="origem" />
          <input name="destination_place" placeholder="destino" />
          <button type="submit">Pesquisar</button>
        </form>
      </div>
      <div id="map" className="h-full w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={position}
            zoom={13}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker
              position={position}
              options={{
                label: {
                  text: 'Posição Teste',
                },
              }}
            />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
