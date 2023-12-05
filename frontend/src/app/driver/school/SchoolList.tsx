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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { EditIcon } from '../../../components/icons/EditIcon';
import { DeleteIcon } from '../../../components/icons/DeleteIcon';
import { errorControl, startNotice } from '../../utils/warnings';
import SchoolForm from './SchoolForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import Confirmation from '../../../components/Confirmation';
import { InfoIcon } from '../../../components/icons/InfoIcon';

const columns = [
  { name: 'ATIVA', uid: 'status' },
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
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();
  const [confirmationAction, setConfirmationAction] = useState('');

  const [started, setStarted] = useState(false);
  const [school, setSchool] = useState<schoolType | null>();
  const [schools, setSchools] = useState<schoolType[]>([]);

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/school`);

      if (data.error === false) {
        setSchools(data.schools);
        setStarted(data.started);
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setSchools, setStarted]);

  // Atualização da lista
  useEffect(() => {
    getList();
  }, [getList, loading]);

  // Aviso que as viagens já iniciaram
  useEffect(() => {
    if (started) {
      startNotice();
    }
  }, [started]);

  const deleteItem = async (item: any) => {
    try {
      const { data } = await axios.delete(`/api/driver/school/${item.id}`);

      if (data.error === false) {
        //
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      throw new Error('Erro ao tentar excluir');
    }
    setLoading(false);
  };

  const debouncedDelete = debounce(async (item) => {
    await toast.promise(deleteItem(item), {
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
    await toast.promise(updateStatus(item), {
      loading: 'Aguarde... ⏳',
      success: 'Status atualizado com sucesso! 😁',
      error: 'Não foi possível atualizar o status. 😥',
    });
  }, 1000);

  const handleConfirm = async (action: any) => {
    if (action === 'delete') {
      setLoading(true);
      await debouncedDelete(school);
    }
  };

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
        return (
          <div>
            <p className="hidden md:flex">{cellValue}</p>
            <p className="flex md:hidden justify-center">• • •</p>
          </div>
        );
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
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
                    setSchool(item);
                    setConfirmationAction('delete');
                    onOpenConfirmation();
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
                • Nessa página é possível cadastrar e visualizar as informações
                de todas as escolas.
              </p>
              <p>• No momento só é possível cadastrar 1 escola por turno.</p>
              <p>
                • É possível desativar a geração das rotas de uma determinada
                escola desativando a opção "ATIVA".
              </p>
              <p>
                • Após iniciar as viagens do dia, não é possível realizar
                alterações e cadastrar novas escolas.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-center gap-20">
        <h1 className="mt-8 mb-6 text-xl font-bold">🏫 Escolas</h1>
        <Button
          className="font-semibold"
          color="primary"
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
          <Table aria-label="Tabela">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                  className="text-center"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={schools} emptyContent={'Sem registros.'}>
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

      {/* MODAL */}

      <div>
        {/* Modal de Cadastro/Atualização */}
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {
            onOpenChange();
            getList();
          }}
          placement="center"
          isDismissable={false}
          className="max-h-[90vh] overflow-y-auto md:max-h-[95vh]"
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

        <Confirmation
          isOpen={isOpenConfirmation}
          onOpen={onOpenConfirmation}
          onOpenChange={onOpenChangeConfirmation}
          onConfirm={handleConfirm}
          action={confirmationAction}
        />
      </div>
    </div>
  );
}
