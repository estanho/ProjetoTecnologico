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
import error from 'next/error';

export default function MyComponent() {
  const [trips, setTrips] = useState([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/trip`);
      if (data.error === false) {
        setTrips(data.trips);
        //toast.success('Lista atualizada! 😁');
      } else {
        console.log(data);
        throw error;
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  const renderList = (trips: any) => {
    return (
      <Card className="m-2">
        <CardBody className="p-2">
          <Accordion>
            {trips &&
              trips.map((day: any, dayIndex: number) => (
                <AccordionItem
                  key={dayIndex}
                  aria-label={`Dia ${day.title}`}
                  title={
                    <div className="flex items-center">
                      <h3 className={`m-2 text-xl font-bold`}>{day.title}</h3>
                    </div>
                  }
                >
                  {day.trips &&
                    day.trips.map((trip: any, turnIndex: number) => (
                      <div key={turnIndex}>
                        <div className="flex justify-between items-center">
                          <h1 className="text-lg font-bold">{trip.title}</h1>
                          <div>
                            <p className="text-sm text-gray-800">
                              Viagem de ~{trip.duration}
                            </p>
                            <p className="text-sm text-end text-gray-400">
                              ({trip.km})
                            </p>
                          </div>
                        </div>
                        {trip.schools && (
                          <div className="ml-2 mt-4">
                            <p className="text-sm text-gray-600">
                              {trip.schools}
                            </p>
                          </div>
                        )}
                        <div className="flex">
                          {trip.end_time && (
                            <div className="ml-2">
                              <p className="text-sm text-gray-600">
                                • Saída: {trip.end_time}
                              </p>
                            </div>
                          )}
                          {trip.start_time && (
                            <div className="ml-2">
                              <p className="text-sm text-gray-600">
                                • Entrada: {trip.start_time}
                              </p>
                            </div>
                          )}
                        </div>
                        {trip.recommendation && (
                          <div className="ml-2 mt-4">
                            <p className="mt-2 text-sm text-gray-600">
                              Recomendação para inciar viagem:{' '}
                              {trip.recommendation}
                            </p>
                          </div>
                        )}
                        {trip.absents && trip.absents.length > 0 && (
                          <div className="m-2">
                            <p className="text-sm font-bold">
                              Alunos Ausentes:
                            </p>
                            <ul>
                              {trip.absents.map(
                                (absent: any, index: number) => (
                                  <li
                                    key={index}
                                    className="text-red-700 text-sm"
                                  >
                                    {absent}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                        {trip.events.map((event: any, eventIndex: number) => (
                          <div
                            key={eventIndex}
                            className={`mt-4 mb-4 ${
                              event.status === 'done'
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            <h3
                              className={`text-lg font-bold mb-2 ${
                                event.status === 'done'
                                  ? 'text-green-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              <span
                                className={`font-bold ${
                                  event.status === 'upcoming'
                                    ? 'text-gray-500'
                                    : ''
                                }`}
                              >
                                {event.title}
                                {event.type}
                              </span>
                              <span className="text-sm float-right">
                                {event.status === 'upcoming'
                                  ? '--:--'
                                  : event.time}
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">
                              {event.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                </AccordionItem>
              ))}
          </Accordion>
        </CardBody>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-20 gap-20">
        <h1 className="text-center mt-8 mb-6 text-xl font-bold">Roteiro</h1>
        <Button className="justify-center" onPress={() => {}}>
          Visualizar Mapa
        </Button>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full ">{renderList(trips)}</div>
      </div>
    </div>
  );
}
