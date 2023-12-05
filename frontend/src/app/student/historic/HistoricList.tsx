'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Chip,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { errorControl } from '../../utils/warnings';
import { InfoIcon } from '../../../components/icons/InfoIcon';

export default function MyComponent() {
  const [student, setStudent] = useState([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/student/historic`);

      if (data.error === false) {
        setStudent(data.student);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setStudent]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList]);

  const renderList = (student: any) => {
    return (
      <div>
        <div className="flex flex-col justify-between gap-2 items-center sm:flex-row m-6">
          <h1 className="text-xl font-semibold mb-4 lg:m-0">
            {' '}
            🤓 {student.name}
          </h1>
        </div>
        <Card>
          <CardBody className="p-2">
            <Accordion>
              {student.itineraries &&
                student.itineraries.map(
                  (itinerary: any, indexItinerary: any) => {
                    return (
                      <AccordionItem
                        key={indexItinerary}
                        aria-label={`Day ${indexItinerary + 1}`}
                        title={
                          <div className="flex items-center justify-between">
                            <h3 className={`m-2 text-xl font-bold`}>
                              {itinerary.title}
                            </h3>
                            <div className="flex gap-2">
                              <Chip
                                size="sm"
                                variant="dot"
                                color={
                                  itinerary.trips[0].events[0].status ===
                                  'absent'
                                    ? 'danger'
                                    : 'success'
                                }
                              >
                                Ida
                              </Chip>
                              <Chip
                                size="sm"
                                variant="dot"
                                color={
                                  itinerary.trips[1].events[1].status ===
                                  'absent'
                                    ? 'danger'
                                    : 'success'
                                }
                              >
                                Volta
                              </Chip>
                            </div>
                          </div>
                        }
                      >
                        {itinerary.trips &&
                          itinerary.trips.map((trip: any, tripIndex: any) => (
                            <div key={tripIndex}>
                              <div className="flex justify-between items-center">
                                <h1 className="text-lg font-bold">
                                  {trip.title}
                                </h1>
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
                              {trip.events.map(
                                (event: any, eventIndex: number) => (
                                  <div
                                    key={eventIndex}
                                    className={`mt-4 mb-4 ${
                                      event.status === 'done'
                                        ? 'bg-green-100'
                                        : event.status === 'absent'
                                        ? 'bg-red-100'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <h3
                                      className={`text-lg font-bold mb-2 ${
                                        event.status === 'done'
                                          ? 'text-green-700'
                                          : event.status === 'absent'
                                          ? 'text-red-500'
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
                                ),
                              )}
                            </div>
                          ))}
                      </AccordionItem>
                    );
                  },
                )}
            </Accordion>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="m-4">
      <div className="flex mt-20 justify-start md:justify-end">
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button size="sm" variant="light" className="">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="max-w-[300px]">
              <p>
                • Nessa página é possível visualizar as informações de todas as
                rotas realizadas até o momento.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-center gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">🕑 Histórico</h1>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full ">
          {student && renderList(student)}
        </div>
      </div>
    </div>
  );
}
