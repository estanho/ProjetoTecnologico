'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { errorControl } from '../../utils/warnings';

const columns = [
  { name: 'TIPO', uid: 'type' },
  { name: 'ALUNO', uid: 'student' },
  { name: 'MOTORISTA', uid: 'responsible' },
  { name: 'HORÁRIO', uid: 'time' },
  { name: 'DIA', uid: 'day' },
];

type notificationType = {
  id: string;
  name: string;
  type: string;
  time: string;
  day: string;
};

export default function App() {
  const [notifications, setNotifications] = useState<notificationType[]>([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/notification/list`);

      if (data.error === false) {
        setNotifications(data.notifications);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setNotifications]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList]);

  const renderList = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'type':
        return (
          <div>
            {item.type === 'embarked' ? (
              <Chip color="warning" variant="flat" size="sm" radius="sm">
                EMBARQUE
              </Chip>
            ) : (
              ''
            )}

            {item.type === 'disembarked' ? (
              <Chip color="success" variant="flat" size="sm" radius="sm">
                DESEMBARQUE
              </Chip>
            ) : (
              ''
            )}
          </div>
        );
      case 'student':
        return <p>{cellValue}</p>;
      case 'responsible':
        return <p>{cellValue}</p>;
      case 'time':
        return <p>{cellValue}</p>;
      case 'day':
        return <p>{cellValue}</p>;
      default:
        return <p>{cellValue}</p>;
    }
  };

  return (
    <div className="m-4">
      <div className="flex items-center justify-center mt-20 gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">🔔 Notificações</h1>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-screen-md w-full">
          <Table aria-label="Tabela">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} className="text-center">
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={notifications} emptyContent={'Sem registros.'}>
              {(item) => (
                <TableRow key={item.id} className="text-center">
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
