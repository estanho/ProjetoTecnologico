'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { errorControl } from '../../utils/warnings';
import { ChevronDownIcon } from '../../../components/icons/ChevronDownIcon';

import { useRouter } from 'next/navigation';
import { InfoIcon } from '../../../components/icons/InfoIcon';

export default function MyComponent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<any>([]);
  const [buttons, setButtons] = useState<any>([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/trip`);

      if (data.error === false) {
        setTrips(data.trips);
        setButtons(data.trips[0].button);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setTrips]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList]);

  const renderList = (trips: any) => {
    return (
      <Card>
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
                  {day.trips && day.trips.length > 0 ? (
                    day.trips.map((trip: any, turnIndex: number) => (
                      <div key={turnIndex}>
                        <div className="flex justify-between items-center">
                          <h1 className="text-lg font-bold">{trip.title}</h1>
                          <div>
                            <p className="text-sm text-end text-gray-800">
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
                    ))
                  ) : (
                    <div>
                      <p className="flex justify-center m-2 text-center text-gray-500">
                        Ocorreu um erro ao gerar a viagem, verifique os dados
                        inseridos em 'Escolas' e 'Estudantes'.
                      </p>
                      <p className="flex justify-center m-2 text-center text-gray-600 font-semibold">
                        Ao cadastrar as Escolas e Estudantes, o sistema deve
                        exibir apenas o aviso de sucesso.
                      </p>
                    </div>
                  )}
                </AccordionItem>
              ))}
          </Accordion>
        </CardBody>
      </Card>
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
                • Nessa página é possível visualizar os 3 últimos dias de rotas
                realizadas. Para visualizar mais dias, acesse o "Histórico".
              </p>
              <p>• O botão de "Mapa" da acesso direto a viagem atual.</p>
              <p>
                • O botão com icone de uma seta à direita da opção de "Mapa" da
                acesso as visualizações das rotas do dia.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-center gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">🚐 Roteiro de Viagens</h1>
        <div>
          <ButtonGroup variant="flat">
            <Button
              isLoading={loading}
              isDisabled={trips.length === 0}
              className="font-semibold"
              color="primary"
              variant="solid"
              onPress={() => {
                router.push('/driver/map');
              }}
            >
              Mapa
            </Button>
            {buttons && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly isLoading={loading} color="primary">
                    <ChevronDownIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="options"
                  selectionMode="single"
                  className="max-w-[300px]"
                  items={buttons}
                >
                  {(item: any) => (
                    <DropdownItem
                      aria-label={item.name}
                      onClick={() => {
                        setLoading(true);
                        router.push(`/driver/map/${item.id}`);
                      }}
                    >
                      <div className="flex">
                        <h1 className="font-semibold mr-2">Ver Rota:</h1>
                        {item.name}
                      </div>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          </ButtonGroup>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full ">
          {trips.length > 0 ? (
            renderList(trips)
          ) : (
            <p className="mt-12 flex justify-center text-center text-gray-500">
              Sem registros de viagens no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
