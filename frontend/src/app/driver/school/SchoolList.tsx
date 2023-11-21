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
  Tooltip,
  useDisclosure,
  Button,
  Switch,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from '@nextui-org/react';
import { EditIcon } from '../../../components/icons/EditIcon';
import { DeleteIcon } from '../../../components/icons/DeleteIcon';
import SchoolForm from './SchoolForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import error from 'next/error';

const columns = [
  { name: 'STATUS', uid: 'status' },
  { name: 'NOME', uid: 'name' },
  { name: 'ENDEREÇO', uid: 'address' },
  { name: 'TURNO', uid: 'shift' },
  { name: 'AÇÕES', uid: 'actions' },
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
        throw error;
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setSchools, setStarted]);

  useEffect(() => {
    getList();
  }, [getList, loading]);

  useEffect(() => {
    if (started) {
      toast(
        'As viagens de hoje já começaram... e por esse motivo não é possível alterar os dados das escolas por enquanto. Finalize as viagens de hoje para conseguir alterar as informações das escolas.',
        {
          duration: 10000,
          icon: '🚐',
          position: 'bottom-left',
        },
      );
    }
  }, [started]);

  const deleteItem = async (item: any) => {
    try {
      const { data } = await axios.delete(`/api/driver/school/${item.id}`);
      if (data.error === true) {
        // Tratar erro
        throw error;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const debouncedDelete = debounce((item) => {
    toast.promise(deleteItem(item), {
      loading: 'Aguarde... ⏳',
      success: 'Item excluído com sucesso! 🗑️',
      error: 'Não foi possível excluir o item. 😥',
    });
  }, 1000);

  const updateStatus = async (item: any) => {
    try {
      const { data } = await axios.patch(`/api/driver/school/${item.id}`, {
        status: item.status,
      });
      if (data.error === true) {
        // Tratar erro
        console.log(error);
        throw error;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const debouncedUpdateStatus = debounce((item) => {
    toast.promise(updateStatus(item), {
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
      case 'address':
        return <p>{cellValue}</p>;
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"></span>
            </Tooltip>
            <Tooltip content="Editar item">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSchool(item);
                  onOpen();
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Deletar item" isDisabled={started}>
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  if (started === false) {
                    setLoading(true);
                    debouncedDelete(item);
                  }
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return (
          <div>
            {item.morning === true ? (
              <Chip color="warning" variant="flat" size="sm" radius="sm">
                Manhã
              </Chip>
            ) : (
              ''
            )}

            {item.afternoon === true ? (
              <Chip color="success" variant="flat" size="sm" radius="sm">
                Tarde
              </Chip>
            ) : (
              ''
            )}

            {item.night === true ? (
              <Chip color="secondary" variant="flat" size="sm" radius="sm">
                Noite
              </Chip>
            ) : (
              ''
            )}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-20 gap-20">
        <h1 className="text-center mt-8 mb-6 text-xl font-bold">Escolas</h1>
        <Button
          className="justify-center"
          onPress={() => {
            setSchool(null);
            onOpen();
          }}
        >
          Adicionar Escola
        </Button>
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
      {/* MODAL */}
      <div>
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {
            onOpenChange();
            getList();
          }}
          placement="center"
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  {school === null ? 'Cadastrar' : 'Atualizar'}
                </ModalHeader>
                <ModalBody>
                  <SchoolForm school={school} started={started} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fechar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
