'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';

import { notifications } from './data';

const typeColorMap = {
  EMBARQUE: 'success',
  DESEMBARQUE: 'warning',
  AUSENTE: 'danger',
};

export default function NotificationsList() {
  const renderCell = React.useCallback((notification, columnKey) => {
    const cellValue = notification[columnKey];

    switch (columnKey) {
      case 'type':
        return (
          <Chip
            className="capitalize"
            color={typeColorMap[notification.type]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'student':
      case 'time':
      case 'day': // Novo campo adicionado
        return <span>{cellValue}</span>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center gap-10">
        <h1 className="text-center mt-8 mb-6">Notificações</h1>
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="max-w-screen-md w-full">
          <Table aria-label="Notifications table">
            <TableHeader
              columns={[
                { uid: 'type', name: 'TIPO' },
                { uid: 'student', name: 'ALUNO' },
                { uid: 'time', name: 'HORÁRIO' },
                { uid: 'day', name: 'DIA' },
              ]}
            >
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={notifications}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
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
