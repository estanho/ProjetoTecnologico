'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Link,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import error from 'next/error';

const schemaData = z.object({
  name: z.string().min(5, 'O nome deve ser completo.'),
  cellphone: z
    .string()
    .regex(
      /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/,
      'Formato incorreto.',
    ),
  email: z.string().email('Email invalido.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  role: z.string(
    z.literal('ResponsibleRole') ||
      z.literal('DriverRole') ||
      z.literal('StudentRole'),
  ),
  cnh: z
    .string()
    .regex(/^(?:[0-9]{11})$/, 'Formato Invalido')
    .nullable(),
  code: z.string().nullable(),
});

type dataType = z.infer<typeof schemaData>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>('');
  const [cellphone, setCellphone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [cnh, setCNH] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaData),
    values: {
      name,
      cellphone,
      email,
      password,
      role,
      cnh,
      code,
    },
  });

  const handleFormSubmit = async (data: dataType) => {
    try {
      setLoading(true);
      const result = await axios.post('/api/auth/sign-up', data);

      if (result.data.error === false) {
        setLoading(false);
        toast.success('Usuário criado com sucesso! 😁');
        router.push('/api/auth/callback');
      } else {
        throw error;
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao cadastrar os dados. 😥');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-xl w-full">
        <CardHeader className="justify-center">
          <p className="text-xl">Cadastrar</p>
        </CardHeader>
        <Divider />
        <CardBody className="p-12">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Input
              {...register('name')}
              type="text"
              variant="faded"
              label="Nome"
              labelPlacement="outside"
              placeholder="Digite seu nome completo"
              className="mb-6"
              onChange={(e) => setName(e.target.value)}
              isRequired
              errorMessage={errors.name && errors.name.message}
            />
            <Input
              {...register('cellphone')}
              type="text"
              variant="faded"
              label="Telefone"
              labelPlacement="outside"
              placeholder="Número para contato"
              className="mb-6"
              onChange={(e) => setCellphone(e.target.value)}
              isRequired
              errorMessage={errors.cellphone && errors.cellphone.message}
            />
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <Input
                {...register('email')}
                type="email"
                variant="faded"
                label="Email"
                labelPlacement="outside"
                placeholder="Digite seu email"
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                errorMessage={errors.name && errors.name.message}
              />
              <Input
                {...register('password')}
                type="password"
                variant="faded"
                label="Senha"
                labelPlacement="outside"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                errorMessage={errors.password && errors.password.message}
              />
            </div>
            <div>
              <RadioGroup
                {...register('role')}
                label="Perfil:"
                name="perfil"
                orientation="horizontal"
                className="mb-6"
                isRequired
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <Radio value="ResponsibleRole">Responsável</Radio>
                <Radio value="DriverRole">Motorista</Radio>
                <Radio value="StudentRole">Estudante</Radio>
              </RadioGroup>
            </div>

            {role === 'DriverRole' && (
              <Input
                type="text"
                name="cnh"
                variant="faded"
                label="Número da CNH"
                labelPlacement="outside"
                placeholder="Digite o número da CNH"
                className="mb-6"
                onChange={(e) => setCNH(e.target.value)}
                isRequired
                errorMessage={errors.cnh && errors.cnh.message}
              />
            )}
            {role === 'StudentRole' && (
              <Input
                type="text"
                name="code"
                variant="faded"
                label="Código de acesso"
                labelPlacement="outside"
                placeholder="Digite o código de acesso gerado pelo motorista"
                className="mb-6"
                onChange={(e) => setCode(e.target.value)}
                isRequired
                errorMessage={errors.code && errors.code.message}
              />
            )}

            <div className="flex flex-col">
              <Button
                type="submit"
                isDisabled={loading}
                isLoading={loading}
                color="primary"
                variant="shadow"
              >
                {loading ? 'Carregando' : 'Cadastrar'}
              </Button>

              <Link href="/auth/login" className="justify-center mt-10">
                Você já possui uma conta? Faça o login
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
