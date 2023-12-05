'use client';

import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { errorControl } from '../../utils/warnings';
import { useRouter } from 'next/navigation';
import { InfoIcon } from '../../../components/icons/InfoIcon';

const columns = [
  { name: 'PRESENTE', uid: 'status' },
  { name: 'NOME', uid: 'name' },
];

type studentTripType = {
  id: string;
  name: string;
  rollCallPresent: boolean;
};

export default function App() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [studentsTrips, setStudentsTrips] = useState<studentTripType[]>([]);
  const [allPresents, setAllPresents] = useState(false);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/rollcall`);

      if (data.error === false) {
        setStudentsTrips(data.studentTrip);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setStudentsTrips]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList, loading]);

  const updateStatus = async (item: any) => {
    try {
      const { data } = await axios.patch(`/api/driver/rollcall/${item.id}`, {
        status: item.status,
      });

      if (data.error === false) {
        setAllPresents(data.result);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      throw new Error('Erro ao tentar acessar a API.');
    }
    setLoading(false);
  };

  const debouncedUpdateStatus = debounce(async (item) => {
    await toast.promise(updateStatus(item), {
      loading: 'Aguarde... ⏳',
      success: 'Status atualizado com sucesso! 😁',
      error: 'Não foi possível atualizar o status. 😥',
    });
  }, 1000);

  const renderList = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'status':
        return (
          <div className="flex flex-col">
            <Switch
              isSelected={cellValue}
              isDisabled={loading}
              onClick={() => {
                setLoading(true);
                debouncedUpdateStatus(item);
              }}
              size="sm"
            ></Switch>
          </div>
        );
      case 'name':
        return <p>{cellValue}</p>;
      default:
        return <p>{cellValue}</p>;
    }
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
                • Nessa página é possível completar a chamada presença de alunos
                para liberar a opção de "Começar Rota".
              </p>
              <p>• A opção de chamada só aparece em retornos das escolas.</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-center gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">📋 Chamada</h1>
        <Button
          className="font-semibold"
          color="primary"
          size="sm"
          onClick={() => router.push('/driver/map')}
        >
          Voltar
        </Button>
      </div>
      <div className="flex justify-center">
        {allPresents === true && (
          <p className="mb-4 text-center text-gray-500 font-light">
            Todos alunos estão presentes. A opção de 'Começar Rota' foi
            liberada.
          </p>
        )}
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full">
          <Table aria-label="Tabela">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={studentsTrips} emptyContent={'Sem registros.'}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderList(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
