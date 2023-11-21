'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  useDisclosure,
  Button,
  ButtonGroup,
  Switch,
} from '@nextui-org/react';
import { columns, users } from './data1';

export default function App() {
  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case 'status':
        return (
          <div className="flex flex-col">
            <Switch defaultSelected size="sm"></Switch>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center gap-10 m-8">
        <h1 className="text-center">
          Chamada - Colégio Fundação Bradesco (Manhã)
        </h1>
        <Button className="">Voltar</Button>
      </div>
      <div className="flex items-center justify-center">
        <Table
          aria-label="Example table with custom cells"
          className="w-full max-w-screen-md"
        >
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
          <TableBody items={users}>
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
  );
}
