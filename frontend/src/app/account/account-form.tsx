'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Input,
  Card,
  CardHeader,
  Divider,
  CardBody,
  RadioGroup,
  Radio,
  Button,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schemaData = z.object({
  name: z.string().min(5, 'O nome deve ser completo.'),
  cellphone: z
    .string()
    .regex(
      /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/,
      'Formato incorreto.',
    ),
  cnh: z
    .string()
    .regex(/^(?:[0-9]{11})$/, 'Formato Invalido')
    .nullable(),
});

type dataType = z.infer<typeof schemaData>;

export default function AccountForm({ user }: any) {
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>('');
  const [cellphone, setCellphone] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [cnh, setCNH] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaData),
    values: { name, cellphone, cnh },
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('users')
        .select(`name, cellphone, role`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
        setCellphone(data.cellphone);
        setRole(data.role);
      }

      if (data?.role === 'DriverRole') {
        const { data, error, status } = await supabase
          .from('drivers')
          .select('cnh')
          .eq('user_id', user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setCNH(data.cnh);
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const handleFormSubmit = async (data: dataType) => {
    try {
      setLoading(true);
      if (role !== 'DriverRole') {
        const { error } = await supabase
          .from('users')
          .update({
            email: user.email,
            name: data.name,
            cellphone: data.cellphone,
          })
          .eq('id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('users')
          .update({
            email: user.email,
            name: data.name,
            cellphone: data.cellphone,
          })
          .eq('id', user?.id);

        if (error) throw error;

        const { error: errorD } = await supabase
          .from('drivers')
          .update({
            cnh: data.cnh,
          })
          .eq('user_id', user?.id);

        if (errorD) throw error;
      }

      toast.success('Dados atualizados com sucesso! 😁');
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar os dados. 😥');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-xl w-full p-6">
        <CardHeader className="justify-center">
          <p className="text-xl">Atualize suas informações</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col w-full justify-center"
          >
            <Input
              {...register('name')}
              type="text"
              variant="faded"
              label="Nome completo"
              labelPlacement="outside"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="mb-6"
              isRequired
              errorMessage={errors.name && errors.name.message}
            />
            <Input
              {...register('cellphone')}
              type="text"
              variant="faded"
              label="Telefone"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              labelPlacement="outside"
              placeholder="Número para contato"
              className="mb-6"
              isRequired
              errorMessage={errors.cellphone && errors.cellphone.message}
            />
            <Input
              type="email"
              variant="faded"
              label="Email"
              value={user.email}
              labelPlacement="outside"
              placeholder="Digite seu email"
              className="mb-6"
              isDisabled
            />
            <RadioGroup
              label="Perfil:"
              name="perfil"
              orientation="horizontal"
              className="mb-6"
              value={role}
              isDisabled
            >
              <Radio value="ResponsibleRole">Responsável</Radio>
              <Radio value="DriverRole">Motorista</Radio>
              <Radio value="StudentRole">Estudante</Radio>
            </RadioGroup>
            {role === 'DriverRole' && (
              <Input
                {...register('cnh')}
                type="text"
                name="cnh"
                variant="faded"
                label="Número da CNH"
                value={cnh || ''}
                onChange={(e) => setCNH(e.target.value)}
                labelPlacement="outside"
                placeholder="Digite o número da CNH"
                className="mb-6"
                isRequired
                errorMessage={errors.cnh && errors.cnh.message}
              />
            )}
            <Button
              type="submit"
              isDisabled={loading}
              isLoading={loading}
              color="primary"
              variant="shadow"
            >
              {loading ? 'Carregando' : 'Atualizar'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
