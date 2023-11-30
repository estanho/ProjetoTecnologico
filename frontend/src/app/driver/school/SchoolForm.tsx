'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Divider,
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
import { setHours, setMinutes, parse, format, parseISO } from 'date-fns';
import axios from 'axios';
import { errorControl } from '../../utils/warnings';

const isTimeFormat = (value: any) => {
  return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(value);
};

const stringDate = (value: string) => {
  const baseDate = parse('00:00', 'HH:mm', new Date());
  const result = setMinutes(
    setHours(baseDate, Number(value.split(':')[0])),
    Number(value.split(':')[1]),
  );
  return result;
};

const dateString = (value: string) => {
  if (value !== null) {
    const result = format(parseISO(value), 'HH:mm');
    return result;
  } else {
    return null;
  }
};

const schemaData = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 letras.'),
    address: z.string(),
    addressDefault: z.string(),
    morning: z.boolean(),
    morning_start: z.string().nullable(),
    morning_end: z.string().nullable(),
    afternoon: z.boolean(),
    afternoon_start: z.string().nullable(),
    afternoon_end: z.string().nullable(),
    night: z.boolean(),
    night_start: z.string().nullable(),
    night_end: z.string().nullable(),
    location: z.object({
      place_id: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
    default_location: z.object({
      place_id: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .refine(
    (data) => {
      const errors = [];
      if (!(data.morning || data.afternoon || data.night)) {
        errors.push('Erro');
      }
      return errors.length === 0;
    },
    {
      message: 'Pelo menos um turno deve estar selecionado.',
      path: ['morning'],
    },
  )
  .refine(
    (data) => {
      const errors = [];
      if (data.morning) {
        if (
          !(isTimeFormat(data.morning_start) && isTimeFormat(data.morning_end))
        ) {
          errors.push('Erro');
        }
      } else if (data.afternoon) {
        if (
          !(
            isTimeFormat(data.afternoon_start) &&
            isTimeFormat(data.afternoon_end)
          )
        ) {
          errors.push('Erro');
        }
      } else if (data.night) {
        if (!(isTimeFormat(data.night_start) && isTimeFormat(data.night_end))) {
          errors.push('Erro');
        }
      }

      return errors.length === 0;
    },
    {
      message: 'Formato de horário está incorreto.',
      path: ['morning'],
    },
  )
  .refine(
    (data) => {
      const errors = [];

      if (data?.morning_start !== null && data?.morning_end !== null) {
        if (stringDate(data?.morning_start) >= stringDate(data?.morning_end)) {
          errors.push('Erro');
        }
      }

      if (data?.afternoon_start !== null && data?.afternoon_end !== null) {
        if (
          stringDate(data?.afternoon_start) >= stringDate(data?.afternoon_end)
        ) {
          errors.push('Erro');
        }
      }

      if (data?.night_start !== null && data?.night_end !== null) {
        if (stringDate(data?.night_start) >= stringDate(data?.night_end)) {
          errors.push('Erro');
        }
      }

      return errors.length === 0;
    },
    {
      message:
        'Horário de entrada não deve ser maior ou igual ao horário de saída.',
      path: ['morning'],
    },
  )
  .refine(
    (data) => {
      const errors = [];

      if (data?.morning_end !== null && data?.afternoon_start !== null) {
        if (
          stringDate(data?.morning_end) >= stringDate(data?.afternoon_start)
        ) {
          errors.push('Erro');
        }
      } else if (data?.afternoon_end !== null && data?.night_start !== null) {
        if (stringDate(data?.afternoon_end) >= stringDate(data?.night_start)) {
          errors.push('Erro');
        }
      }

      return errors.length === 0;
    },
    {
      message: 'Os horário dos diferentes turnos não podem conflitar.',
      path: ['morning'],
    },
  );

type dataType = z.infer<typeof schemaData>;

type locationType = {
  place_id: string;
  latitude: number;
  longitude: number;
};

const libraries = ['places'];

export default function SchoolForm({ school, started }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: 'pt-br',
    libraries: libraries as Libraries,
  });

  const [loading, setLoading] = useState(false);

  const [shifts, setShifts] = useState<any>();
  const [name, setName] = useState<string>('');
  const [address, setAdress] = useState<string>('');
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const [location, setLocation] = useState<locationType>({
    place_id: '',
    latitude: 0,
    longitude: 0,
  });

  const [addressDefault, setAddressDefault] = useState<string>('');
  const [autocompleteDefault, setAutocompleteDefault] =
    useState<google.maps.places.Autocomplete>();
  const [locationDefault, setLocationDefault] = useState<locationType>({
    place_id: '',
    latitude: 0,
    longitude: 0,
  });

  const [morning, setMorning] = useState<boolean>(false);
  const [morning_start, setMorning_start] = useState<string | null>('');
  const [morning_end, setMorning_end] = useState<string | null>('');
  const [afternoon, setAfternoon] = useState(false);
  const [afternoon_start, setAfternoon_start] = useState<string | null>('');
  const [afternoon_end, setAfternoon_end] = useState<string | null>('');
  const [night, setNight] = useState(false);
  const [night_start, setNight_start] = useState<string | null>('');
  const [night_end, setNight_end] = useState<string | null>('');

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaData),
    values: {
      name,
      address,
      addressDefault,
      morning,
      morning_start,
      morning_end,
      afternoon,
      afternoon_start,
      afternoon_end,
      night,
      night_start,
      night_end,
      location: location,
      default_location: locationDefault,
    },
  });

  const getSchools = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/driver/shift`);

      if (data.error === false) {
        setShifts({
          morning: data.data.morning,
          afternoon: data.data.afternoon,
          night: data.data.night,
        });
      } else {
        errorControl(data.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar as escolas. 😥');
    }
    setLoading(false);
  }, []);

  const getItem = useCallback(async () => {
    try {
      if (school !== null) {
        setLoading(true);
        setName(school.name);
        setAdress(school.address);
        setAddressDefault(school.default_address);
        setMorning(school.morning);
        setMorning_start(dateString(school.morning_arrival));
        setMorning_end(dateString(school.morning_departure));
        setAfternoon(school.afternoon);
        setAfternoon_start(dateString(school.afternoon_arrival));
        setAfternoon_end(dateString(school.afternoon_departure));
        setNight(school.night);
        setNight_start(dateString(school.night_arrival));
        setNight_end(dateString(school.night_departure));
        setLocation({
          place_id: school.location.place_id,
          latitude: school.location.latitude,
          longitude: school.location.longitude,
        });
        setLocationDefault({
          place_id: school.default_location.place_id,
          latitude: school.default_location.latitude,
          longitude: school.default_location.longitude,
        });
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os dados. 😥');
    }
    setLoading(false);
  }, [school]);

  // Atualizando informações
  useEffect(() => {
    getSchools();
    getItem();
  }, [getItem, getSchools]);

  const handleFormSubmit = async (data: dataType) => {
    try {
      if (started === false) {
        setLoading(true);
        let result;

        if (school === null) {
          result = await axios.post('/api/driver/school', data);
        } else {
          result = await axios.put(`/api/driver/school/${school.id}`, {
            address_id: school.location.id,
            default_id: school.default_location.id,
            data,
          });
        }

        if (result.data.error === false) {
          toast.success('Alteração realizada com sucesso! 😁');
        } else {
          errorControl(result.data.message);
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

  const onLoadDefault = (ref: google.maps.places.Autocomplete) => {
    setAutocompleteDefault(ref);
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

  const onPlaceChangedDefault = () => {
    if (autocompleteDefault) {
      const place = autocompleteDefault!.getPlace();
      const location = {
        latitude: place?.geometry?.location?.lat() || 0,
        longitude: place?.geometry?.location?.lng() || 0,
        place_id: place?.place_id || '',
      };

      if (place) {
        setAddressDefault(place.formatted_address as string);
        setLocationDefault(location);
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
              placeholder="Digite o nome da escola"
              className="mb-6"
              onChange={(e) => setName(e.target.value)}
              isRequired
              errorMessage={errors.name && errors.name.message}
            />
            <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
              <Input
                {...register('address')}
                variant="faded"
                label="Endereço Escola"
                labelPlacement="outside"
                placeholder="Digite o endereço"
                className="mb-6"
                isRequired
              />
            </Autocomplete>

            <Divider className="my-4" />

            <Autocomplete
              onPlaceChanged={onPlaceChangedDefault}
              onLoad={onLoadDefault}
            >
              <Input
                {...register('addressDefault')}
                variant="faded"
                label="Endereço padrão para início da viagem"
                labelPlacement="outside"
                placeholder="Digite o endereço"
                className="mb-6"
                isRequired
              />
            </Autocomplete>

            <p className="mb-4 font-semibold">Turnos</p>
            <div className="mb-6">
              <Checkbox
                {...register('morning')}
                isDisabled={
                  shifts &&
                  shifts.morning === true &&
                  (school ? school.morning === false : true)
                }
                isSelected={morning}
                onChange={(e) => setMorning(e.target.checked)}
              >
                Manhã
              </Checkbox>
              <div className="flex items-center">
                <Input
                  {...register('morning_start')}
                  type="time"
                  variant="faded"
                  label="Horário Entrada"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setMorning_start(e.target.value)}
                  isDisabled={!morning}
                  isRequired={morning}
                  errorMessage={
                    errors.morning_start && errors.morning_start.message
                  }
                />
                <Input
                  {...register('morning_end')}
                  type="time"
                  variant="faded"
                  label="Horário Saída"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setMorning_end(e.target.value)}
                  isDisabled={!morning}
                  isRequired={morning}
                  errorMessage={
                    errors.morning_end && errors.morning_end.message
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Checkbox
                {...register('afternoon')}
                isSelected={afternoon}
                isDisabled={
                  shifts &&
                  shifts.afternoon === true &&
                  (school ? school.afternoon === false : true)
                }
                onChange={(e) => setAfternoon(e.target.checked)}
              >
                Tarde
              </Checkbox>
              <div className="flex items-center">
                <Input
                  {...register('afternoon_start')}
                  type="time"
                  variant="faded"
                  label="Horário Entrada"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setAfternoon_start(e.target.value)}
                  isDisabled={!afternoon}
                  isRequired={afternoon}
                  errorMessage={
                    errors.afternoon_start && errors.afternoon_start.message
                  }
                />
                <Input
                  {...register('afternoon_end')}
                  type="time"
                  variant="faded"
                  label="Horário Saída"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setAfternoon_end(e.target.value)}
                  isDisabled={!afternoon}
                  isRequired={afternoon}
                  errorMessage={
                    errors.afternoon_end && errors.afternoon_end.message
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Checkbox
                {...register('night')}
                isSelected={night}
                isDisabled={
                  shifts &&
                  shifts.night === true &&
                  (school ? school.night === false : true)
                }
                onChange={(e) => setNight(e.target.checked)}
              >
                Noite
              </Checkbox>
              <div className="flex items-center">
                <Input
                  {...register('night_start')}
                  type="time"
                  variant="faded"
                  label="Horário Entrada"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setNight_start(e.target.value)}
                  isDisabled={!night}
                  isRequired={night}
                  errorMessage={
                    errors.night_start && errors.night_start.message
                  }
                />
                <Input
                  {...register('night_end')}
                  type="time"
                  variant="faded"
                  label="Horário Saída"
                  placeholder="00:00"
                  className="ml-2"
                  onChange={(e) => setNight_end(e.target.value)}
                  isDisabled={!night}
                  isRequired={night}
                  errorMessage={errors.night_end && errors.night_end.message}
                />
              </div>
            </div>

            <div className="flex flex-col">
              {errors.morning && (
                <p className="text-center text-bold text-sm text-red-500 mb-4">
                  {errors.morning.message}
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
                  : `${school === null ? 'Cadastrar' : 'Atualizar'}`}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    )
  );
}
