'use client';

import { useRouter } from 'next/navigation';
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
import debounce from 'lodash.debounce';
import { errorControl } from '../../utils/warnings';

export default function MyComponent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/responsible/trip`);

      if (data.error === false) {
        setStudents(data.students);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setStudents]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList, loading]);

  const updateStatus = async (item: any) => {
    try {
      const { data } = await axios.patch(
        `/api/responsible/trip/${item.trip_id}`,
        {
          student_id: item.student_id,
          driver_id: item.driver_id,
          type: item.type,
        },
      );
      if (data.error === false) {
        //
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      throw new Error('Erro ao tentar acessar a API.');
    }
    setLoading(false);
  };

  const debouncedUpdateStatus = debounce(async (item) => {
    toast.promise(updateStatus(item), {
      loading: 'Aguarde... ⏳',
      success: 'Item alterado com sucesso! 👍🏻',
      error: 'Não foi possível realizar a alteração. 😥',
    });
  }, 1000);

  const renderList = (student: any, index: any) => {
    return (
      <div key={index}>
        <div className="flex flex-col justify-between gap-2 items-center sm:flex-row m-6">
          <h1 className="text-xl font-semibold mb-4 lg:m-0">
            {' '}
            🤓 {student.name}
          </h1>
          <div className="flex items-center gap-4">
            <h1 className="font-medium text-gray-700 text-sm">
              Marcar ausência:
            </h1>
            <Button
              isLoading={loading}
              className="font-medium"
              size="sm"
              color={
                student.itineraries[0]?.trips[0].events[0].status === 'absent'
                  ? 'danger'
                  : 'success'
              }
              isDisabled={
                student.itineraries[0]?.trips[0]?.started === '' ? false : true
              }
              onPress={() => {
                setLoading(true);
                debouncedUpdateStatus({
                  trip_id: student.itineraries[0]?.trips[0].id,
                  student_id: student.id,
                  driver_id: student.driver_id,
                  type: 'going',
                });
              }}
            >
              Ida
            </Button>
            <Button
              isLoading={loading}
              className="font-medium"
              size="sm"
              color={
                student.itineraries[0]?.trips[1].events[1].status === 'absent'
                  ? 'danger'
                  : 'success'
              }
              isDisabled={
                student.itineraries[0]?.trips[1]?.started === '' ? false : true
              }
              onPress={() => {
                setLoading(true);
                debouncedUpdateStatus({
                  trip_id: student.itineraries[0]?.trips[1].id,
                  student_id: student.id,
                  driver_id: student.driver_id,
                  type: 'return',
                });
              }}
            >
              Volta
            </Button>
          </div>
          <Button
            className="font-semibold mt-6 lg:m-0"
            size="sm"
            color="primary"
            onPress={() => {
              router.push(`/responsible/map/${student.id}`);
            }}
          >
            Visualizar Mapa
          </Button>
        </div>
        <Card>
          <CardBody className="p-2">
            <Accordion>
              {student.itineraries.length > 0 ? (
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
                )
              ) : (
                <div>
                  <p className="mt-12 flex justify-center text-center text-gray-500">
                    Sem registros de viagens no momento.
                  </p>
                </div>
              )}
            </Accordion>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="m-4">
      <div className="flex items-center justify-center mt-20 gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">🚐 Roteiro de Viagens</h1>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full ">
          {students.length > 0 ? (
            students.map((student: any, index: any) =>
              renderList(student, index),
            )
          ) : (
            <p className="mt-12 flex justify-center text-center text-gray-500">
              Nenhum estudante cadastrado no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
