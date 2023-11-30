'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Confirmation from '../../../components/Confirmation';
import { errorControl } from '../../utils/warnings';
import { useRouter } from 'next/navigation';

export default function MyComponent({ isNear, isEnd, onChildData }: any) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<any>([]);
  const [isNextDay, setIsNextDay] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenEnd,
    onOpen: onOpenEnd,
    onOpenChange: onOpenChangeEnd,
  } = useDisclosure();
  const [confirmationAction, setConfirmationAction] = useState('');

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/map/travel`);

      if (data.error === false) {
        setItinerary(data.itinerary);

        let day = new Date();
        day.setDate(day.getDate() + 1);
        day.setHours(0, 0, 0, 0);

        let itineraryDay = new Date(data.itinerary.day);

        setIsNextDay(itineraryDay.getTime() === day.getTime());
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
  }, [getList, loading]);

  const startTrip = async (item: any) => {
    try {
      const { data } = await axios.patch(
        `/api/driver/map/travel/start/${item.trip.id}`,
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
  const debouncedStart = debounce(async (item) => {
    await toast.promise(startTrip(item), {
      loading: 'Aguarde... ⏳',
      success: 'Começando a viagem! 😁',
      error: 'Não foi possível iniciar a viagem. 😥',
    });
    onChildData(true);
  }, 1000);

  const catchStudent = async (item: any) => {
    try {
      const { data } = await axios.patch(
        `/api/driver/map/travel/student/${item.trip.id}`,
      );

      if (data.error === false) {
        //
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      setLoading(false);
      throw new Error('Erro ao tentar acessar a API.');
    }
    setLoading(false);
  };
  const debouncedCatch = debounce(async (item) => {
    await toast.promise(catchStudent(item), {
      loading: 'Aguarde... ⏳',
      success: 'Status do aluno atualizado! 😁',
      error: 'Não foi possível atualizar o status do aluno. 😥',
    });
    onChildData(true);
  }, 1000);

  const startEnd = async (item: any) => {
    try {
      const { data } = await axios.patch(
        `/api/driver/map/travel/end/${item.trip.id}`,
      );

      if (data.error === false) {
        onOpenEnd();
        setTimeout(() => {
          router.push('/driver/trips');
        }, 5000);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      throw new Error('Erro ao tentar acessar a API.');
    }
    setLoading(false);
  };
  const debouncedEnd = debounce(async (item) => {
    await toast.promise(startEnd(item), {
      loading: 'Aguarde... ⏳',
      success: 'Viagem Finalizada com Sucesso! 😁',
      error: 'Não foi possível finalizar a viagem. 😥',
    });
    onChildData(true);
  }, 1000);

  const handleConfirm = async (action: any) => {
    if (action === 'catch') {
      setLoading(true);
      await debouncedCatch(itinerary);
    } else if (action === 'start') {
      setLoading(true);
      await debouncedStart(itinerary);
    } else if (action === 'end') {
      setLoading(true);
      await debouncedEnd(itinerary);
    }
  };

  const renderList = (itinerary: any) => {
    return (
      <div>
        <div className="flex justify-end items-end">
          {itinerary?.trip?.rollCall === true && (
            <Button
              isLoading={loading}
              className="font-medium m-2"
              size="sm"
              color="primary"
              onClick={() => {
                router.push('/driver/rollcall');
              }}
            >
              Chamada de Presença
            </Button>
          )}
          {itinerary?.trip?.started === '' && (
            <Button
              isLoading={loading}
              isDisabled={itinerary?.trip?.rollCall || isNextDay}
              className="font-medium m-2"
              size="sm"
              color="primary"
              onPress={() => {
                setConfirmationAction('start');
                onOpen();
              }}
            >
              Começar Rota
            </Button>
          )}
          {isNear === true && isEnd === false && (
            <Button
              isLoading={loading}
              className="font-medium m-2"
              size="sm"
              color="primary"
              onPress={() => {
                setConfirmationAction('catch');
                onOpen();
              }}
            >
              {itinerary.trip.events[0].type === ' - Embarque'
                ? 'Aluno(a) Embarcou'
                : 'Aluno(a) Desembarcou'}
            </Button>
          )}
          {isEnd === true && (
            <Button
              isLoading={loading}
              className="font-medium m-2"
              size="sm"
              color="primary"
              onPress={() => {
                setConfirmationAction('end');
                onOpen();
              }}
            >
              Finalizar Corrida
            </Button>
          )}
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
    <div>
      <div className="absolute bottom-0 left-0 right-0">
        {itinerary && renderList(itinerary)}
      </div>

      {/* MODALS */}
      <Confirmation
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleConfirm}
        action={confirmationAction}
      />

      <Modal
        isOpen={isOpenEnd}
        onOpenChange={() => {
          onOpenChangeEnd();
        }}
        placement="center"
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>🎊 Viagem Finalizada 😁 🎊</ModalHeader>
              <ModalBody>
                Você será redirecionado, aguarde 5 segundos ...
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
