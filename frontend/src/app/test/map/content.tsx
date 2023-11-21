'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Button,
  Chip,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import error from 'next/error';
import debounce from 'lodash.debounce';

export default function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/map`);
      if (data.error === false) {
        setItinerary(data.itinerary);
        //toast.success('Lista atualizada! 😁');
      } else {
        throw error;
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, []);

  useEffect(() => {
    getList();
  }, [getList, loading]);

  const renderList = (itinerary: any) => {
    return (
      <div>
        <div className="flex flex-col justify-between items-end">
          <Button
            className="font-medium m-2"
            size="sm"
            color="primary"
            onPress={() => {
              console.log(itinerary);
            }}
          >
            Acompanhar Viagem
          </Button>
        </div>
        <Card>
          <CardBody className="p-2">
            <Accordion>
              <AccordionItem
                textValue="Lista de horarios"
                aria-label={itinerary?.title}
                title={
                  <div className="flex flex-col items-start">
                    <h1 className={`text-sm font-bold`}>
                      {itinerary.trips?.title}
                    </h1>
                    <p>{itinerary.trips?.events[0].title}</p>
                  </div>
                }
                className="max-h-[60vh] overflow-y-auto"
              >
                <div>
                  {itinerary.trips?.schools && (
                    <div className="ml-2">
                      <p className="text-sm text-gray-600">
                        {itinerary.trips.schools}
                      </p>
                    </div>
                  )}
                  <div className="flex">
                    {itinerary.trips?.end_time && (
                      <div className="ml-2">
                        <p className="text-sm text-gray-600">
                          • Saída: {itinerary.trips.end_time}
                        </p>
                      </div>
                    )}
                    {itinerary.trips?.start_time && (
                      <div className="ml-2">
                        <p className="text-sm text-gray-600">
                          • Entrada: {itinerary.trips.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                  {itinerary.trips?.events.map(
                    (event: any, eventIndex: number) => (
                      <div
                        key={eventIndex}
                        className={`mt-2 mb-2 ${
                          event.status === 'done'
                            ? 'bg-green-100'
                            : event.status === 'absent'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <h3
                          className={`text-lg font-bold ${
                            event.status === 'done'
                              ? 'text-green-700'
                              : event.status === 'absent'
                              ? 'text-red-500'
                              : 'text-gray-700'
                          }`}
                        >
                          <span
                            className={`font-bold ${
                              event.status === 'upcoming' ? 'text-gray-500' : ''
                            }`}
                          >
                            {event.title}
                            {event.type}
                          </span>
                          <span className="text-sm float-right">
                            {event.status === 'upcoming' ? '--:--' : event.time}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          {event.location}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {itinerary && renderList(itinerary)}
    </div>
  );
}
