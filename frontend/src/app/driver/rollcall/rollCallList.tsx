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
  useDisclosure,
  Switch,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';

const columns = [
  { name: 'STATUS', uid: 'status' },
  { name: 'NOME', uid: 'name' },
];

type schoolType = {
  id: string;
  name: string;
  address: string;
  status: boolean;
  shift: string;
  arrival_time: string | null;
  departure_time: string | null;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [started, setStarted] = useState(false);

  const [school, setSchool] = useState<schoolType | null>();
  const [schools, setSchools] = useState<schoolType[]>([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/school`);
      if (data.error === false) {
        setSchools(data.schools);
        setStarted(data.started);
        //toast.success('Lista atualizada! 😁');
      } else {
        throw new Error('Erro ao tentar buscar informações.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setSchools, setStarted]);

  useEffect(() => {
    getList();
  }, [getList, loading]);

  const updateStatus = async (item: any) => {
    try {
      const { data } = await axios.patch(`/api/driver/school/${item.id}`, {
        status: item.status,
      });
      if (data.error === true) {
        // Tratar erro
        console.log(data.error);
        throw new Error('Erro ao tentar fazer o update da informação.');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
              isDisabled={loading || started}
              onClick={() => {
                if (started === false) {
                  setLoading(true);
                  debouncedUpdateStatus(item);
                }
              }}
              size="sm"
            ></Switch>
          </div>
        );
      case 'name':
        return <p>{cellValue}</p>;
      default:
       
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-20 gap-20">
        <h1 className="text-center mt-8 mb-6 text-xl font-bold">Chamada de Presença</h1>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full">
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={schools} emptyContent={'Sem registros.'}>
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
