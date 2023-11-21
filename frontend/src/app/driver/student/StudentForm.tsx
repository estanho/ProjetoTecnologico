'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  useJsApiLoader,
  Libraries,
  Autocomplete,
} from '@react-google-maps/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import error from 'next/error';

const isEmail = (value: any) => {
  return /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(,\s([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))*$/.test(
    value,
  );
};

const schemaData = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 letras.'),
    address: z.string(),
    school: z.string(),
    responsibles_email: z.string(),
    shift: z.string(),
    location: z.object({
      place_id: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .refine(
    (data) => {
      const errors = [];
      if (data.shift === '') {
        errors.push('Erro');
      }
      return errors.length === 0;
    },
    {
      message: 'Selecione um turno.',
      path: ['shift'],
    },
  )
  .refine(
    (data) => {
      const errors = [];
      if (data.responsibles_email !== '') {
        if (!isEmail(data.responsibles_email)) {
          errors.push('Erro');
        }
      }

      return errors.length === 0;
    },
    {
      message: 'Email inválido',
      path: ['shift'],
    },
  );

type dataType = z.infer<typeof schemaData>;

const libraries = ['places'];

type locationType = {
  place_id: string;
  latitude: number;
  longitude: number;
};

type schoolType = {
  id: string;
  name: string;
  address: string;
  status: boolean;
  morning: boolean;
  morning_arrival: string | null;
  morning_departure: string | null;
  afternoon: boolean;
  afternoon_arrival: string | null;
  afternoon_departure: string | null;
  night: boolean;
  night_arrival: string | null;
  night_departure: string | null;
};

export default function StudentForm({ student, started }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: 'pt-br',
    libraries: libraries as Libraries,
  });

  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<schoolType[]>([]);
  const [school, setSchool] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAdress] = useState<string>('');
  const [responsibles_email, setResponsibles_email] = useState<string>('');
  const [shift, setShift] = useState<string>('');
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const [location, setLocation] = useState<locationType>({
    place_id: '',
    latitude: 0,
    longitude: 0,
  });

  const [school_info, setSchool_info] = useState<schoolType | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaData),
    values: {
      name,
      address,
      school,
      shift,
      location: location,
      responsibles_email,
    },
  });

  const getSchools = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/driver/school`,
      );
      if (data.error === false) {
        setSchools(data.schools);
        if (student !== null) {
          if (data.schools.length > 0) {
            const foundSchool = data.schools.find(
              (item: any) => item.id === student.school_id,
            );
            setSchool_info(foundSchool);
          }
        }
      } else {
        throw error;
      }
    } catch (error) {
      console.log(error);
      toast.error('Ocorreu um erro ao carregar as escolas. 😥');
    }
  }, [student]);

  const getItem = useCallback(async () => {
    try {
      if (student !== null) {
        setLoading(true);
        setName(student.name);
        setAdress(student.address);
        setShift(student.shift);
        setLocation({
          place_id: student.location.place_id,
          latitude: student.location.latitude,
          longitude: student.location.longitude,
        });
        setResponsibles_email(student.responsibles_email);
        setSchool(student.school_id);
      }
      //
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    } finally {
      setLoading(false);
    }
  }, [student]);

  useEffect(() => {
    getSchools();
    getItem();
  }, [getItem, getSchools]);

  const handleFormSubmit = async (data: dataType) => {
    try {
      if (started === false) {
        setLoading(true);
        let result;
        if (student === null) {
          result = await axios.post('/api/driver/student', data);
        } else {
          result = await axios.put(`/api/driver/student/${student.id}`, {
            address_id: student.location.id,
            data,
          });
        }

        if (result.data.error === false) {
          setLoading(false);
          toast.success('Aluno cadastrado com sucesso! 😁');
        } else {
          throw error;
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar os dados. 😥');
    }
    setLoading(false);
  };

  const onLoad = (ref: google.maps.places.Autocomplete) => {
    setAutocomplete(ref);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete!.getPlace();
      const location = {
        latitude: place?.geometry?.location?.lat() || 0,
        longitude: place?.geometry?.location?.lng() || 0,
        place_id: place?.place_id || '',
      };

      if (place) {
        setAdress(place.formatted_address as string);
        setLocation(location);
      }
    }
  };

  return (
    isLoaded && (
      <Card className="max-w-xl w-full">
        <CardBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Input
              {...register('name')}
              type="text"
              variant="faded"
              label="Nome"
              labelPlacement="outside"
              placeholder="Digite o nome do aluno"
              className="mb-6"
              onChange={(e) => setName(e.target.value)}
              isRequired
              errorMessage={errors.name && errors.name.message}
            />
            <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
              <Input
                {...register('address')}
                variant="faded"
                label="Endereço"
                labelPlacement="outside"
                placeholder="Digite o endereço"
                className="mb-6"
                isRequired
              />
            </Autocomplete>

            <Input
              type="email"
              variant="faded"
              label="Email Aluno"
              labelPlacement="outside"
              placeholder="Email do Aluno"
              className="mb-6"
              value={student && student.email ? student.email : ''}
              isDisabled={true}
            />

            <Select
              items={schools}
              label="Escola"
              placeholder="Selecione a escola"
              labelPlacement="outside"
              variant="faded"
              className="mb-6"
              selectedKeys={school_info ? [school_info.id] : []}
              onChange={(e) => {
                setShift('');
                setSchool(e.target.value);
              }}
              isRequired
            >
              {(item) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                  onClick={() => setSchool_info(item)}
                >
                  <div className="flex flex-col">
                    <span className="text-small">{item.name}</span>
                    <span className="text-tiny text-default-400">
                      {item.address}
                    </span>
                  </div>
                </SelectItem>
              )}
            </Select>

            <Input
              {...register('responsibles_email')}
              type="text"
              variant="faded"
              label="Responsáveis"
              labelPlacement="outside"
              placeholder="Digite o email dos responsáveis (Opcional)"
              className="mb-6"
              onChange={(e) => setResponsibles_email(e.target.value)}
              errorMessage={
                errors.responsibles_email && errors.responsibles_email.message
              }
            />

            <p className="font-semibold">Turnos</p>
            <div className="p-2 mb-6">
              <RadioGroup
                orientation="horizontal"
                isDisabled={!school}
                value={shift}
                onValueChange={(e) => setShift(e)}
              >
                <Radio value="morning" isDisabled={!school_info?.morning}>
                  Manhã
                </Radio>
                <Radio value="afternoon" isDisabled={!school_info?.afternoon}>
                  Tarde
                </Radio>
                <Radio value="night" isDisabled={!school_info?.night}>
                  Noite
                </Radio>
              </RadioGroup>
            </div>

            <div className="flex flex-col">
              {errors.shift && (
                <p className="text-center text-bold text-sm text-red-500 mb-4">
                  {errors.shift.message}
                </p>
              )}

              <Button
                type="submit"
                isDisabled={loading || started}
                isLoading={loading}
                color="primary"
                variant="shadow"
              >
                {loading
                  ? 'Carregando'
                  : `${student === null ? 'Cadastrar' : 'Atualizar'}`}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    )
  );
}
