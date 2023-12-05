'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Button,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { errorControl } from '../../../utils/warnings';
import { useRouter } from 'next/navigation';

export default function MyComponent({ trip_id }: any) {
  const router = useRouter();

  const [itinerary, setItinerary] = useState<any>([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/map/travel/${trip_id}`);

      if (data.error === false) {
        setItinerary(data.itinerary);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, []);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList]);

  const renderList = (itinerary: any) => {
    return (
      <div>
        <div className="flex justify-end items-end">
          <Button
            className="font-medium m-2"
            size="sm"
            color="primary"
            onPress={() => {
              router.push('/driver/trips');
            }}
          >
            Voltar
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
                      {itinerary.trip?.title}
                    </h1>
                    <p>{itinerary.trip?.events[0].title}</p>
                  </div>
                }
                className="max-h-[60vh] overflow-y-auto"
              >
                <div>
                  {itinerary.trip?.schools && (
                    <div className="ml-2">
                      <p className="text-sm text-gray-600">
                        {itinerary.trip.schools}
                      </p>
                    </div>
                  )}
                  <div className="flex">
                    {itinerary.trip?.end_time && (
                      <div className="ml-2">
                        <p className="text-sm text-gray-600">
                          • Saída: {itinerary.trip.end_time}
                        </p>
                      </div>
                    )}
                    {itinerary.trip?.start_time && (
                      <div className="ml-2">
                        <p className="text-sm text-gray-600">
                          • Entrada: {itinerary.trip.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                  {itinerary.trip?.events.map(
                    (event: any, eventIndex: number) => (
                      <div key={eventIndex} className="mt-2 mb-2 bg-gray-100">
                        <h3 className="text-lg font-bold text-gray-700">
                          <span className="font-bold text-gray-500">
                            {event.title}
                            {event.type}
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
