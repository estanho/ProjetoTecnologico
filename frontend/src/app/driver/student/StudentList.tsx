'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from '@nextui-org/react';
import { EyeIcon } from '../../../components/icons/EyeIcon';
import { EditIcon } from '../../../components/icons/EditIcon';
import { DeleteIcon } from '../../../components/icons/DeleteIcon';
import StudentForm from './StudentForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import error from 'next/error';

const columns = [
  { name: 'NOME', uid: 'name' },
  { name: 'ENDEREÇO ALUNO', uid: 'address' },
  { name: 'ESCOLA', uid: 'school_name' },
  { name: 'TURNO', uid: 'turn' },
  { name: 'AÇÕES', uid: 'actions' },
];

type studentType = {
  id: string;
  name: string;
  code: string;
  address: string;
  email: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  goes: boolean;
  return: boolean;
  school_name: string;
  responsibles: [{ name: string; cellphone: string }];
  responsibles_email: string;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onOpenChange: onOpenChangeInfo,
  } = useDisclosure();
  const [started, setStarted] = useState(false);

  const [student, setStudent] = useState<studentType | null>();
  const [students, setStudents] = useState<studentType[]>([]);

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`Código de acesso: ${code}`);
    setIsCopied(true);
    // Reset isCopied state after a short delay
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const getList = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/student`);
      if (data.error === false) {
        setStudents(data.data);
        setStarted(data.started);
        //toast.success('Lista atualizada! 😁');
      } else {
        console.log(data);
        throw error;
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
  }, [setStudents, setStarted]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (started) {
      toast(
        'As viagens de hoje já começaram... e por esse motivo não é possível alterar os dados dos alunos por enquanto. Finalize as viagens de hoje para conseguir alterar as informações dos alunos.',
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
      const { data } = await axios.delete(`/api/driver/student/${item.id}`);
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

  const renderList = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'name':
        return <p>{cellValue}</p>;
      case 'address':
        return <p>{cellValue}</p>;
      case 'school_name':
        return <p>{cellValue}</p>;
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setStudent(item);
                  onOpenInfo();
                }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar item">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setStudent(item);
                  onOpen();
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Deletar item">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  if (started === false) {
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
            {item.shift === 'morning' ? (
              <Chip color="warning" variant="flat" size="sm" radius="sm">
                Manhã
              </Chip>
            ) : (
              ''
            )}

            {item.shift === 'afternoon' ? (
              <Chip color="success" variant="flat" size="sm" radius="sm">
                Tarde
              </Chip>
            ) : (
              ''
            )}

            {item.shift === 'night' ? (
              <Chip color="secondary" variant="flat" size="sm" radius="sm">
                Noite
              </Chip>
            ) : (
              ''
            )}
            {item.shift === '' ? (
              <Chip color="danger" variant="flat" size="sm" radius="sm">
                Inválido
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
        <h1 className="text-center mt-8 mb-6 text-xl font-bold">Alunos</h1>
        <Button
          className="justify-center"
          onPress={() => {
            setStudent(null);
            onOpen();
          }}
        >
          Adicionar Aluno
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
            <TableBody items={students} emptyContent={'Sem registros.'}>
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
      {/* MODALS */}
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
                  {student === null ? 'Cadastrar' : 'Atualizar'}
                </ModalHeader>
                <ModalBody>
                  <StudentForm student={student} started={started} />
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

        <Modal
          isOpen={isOpenInfo}
          onOpenChange={() => {
            onOpenChangeInfo();
            getList();
          }}
          isDismissable={false}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col font-bold text-center">
                  {student && student.name}
                </ModalHeader>
                <ModalBody>
                  <p>
                    <span className="font-bold">Escola: </span>
                    <span>{student && student.school_name}</span>
                  </p>
                  <p>
                    <span className="font-bold">Endereço Aluno: </span>
                    <span>{student && student.address}</span>
                  </p>
                  <p>
                    <span className="font-bold">Email Aluno: </span>
                    <span>
                      {(student && student.email) || 'Não registrado'}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Aluno vai hoje: </span>
                    <span>
                      {student && student.goes === true ? 'Sim' : 'Não'}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Aluno vai voltar: </span>
                    <span>
                      {student && student.return === true ? 'Sim' : 'Não'}
                    </span>
                  </p>
                  <div>
                    <span className="font-bold">Código do Aluno: </span>
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      className="font-bold"
                      onClick={() => student && copyToClipboard(student?.code)}
                    >
                      Copiar
                    </Button>
                    {isCopied && <span> - Copiado!</span>}
                  </div>
                  <p>
                    <span className="font-bold">Responsáveis: </span>
                    <span>
                      {(student && student.responsibles_email) ||
                        'Não registrado'}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Contato Responsáveis: </span>
                  </p>
                  {student?.responsibles.map((item, index) => (
                    <Button
                      isDisabled={item.name === ''}
                      color="primary"
                      key={index}
                      onClick={() =>
                        window.open(
                          `https://wa.me/55${item.cellphone}`,
                          '_blank',
                        )
                      }
                    >
                      {item.name ? item.name : 'Responsável não registrado'}
                    </Button>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {/* Outras ações do rodapé do modal */}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
