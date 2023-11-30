'use client';

import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';

import { useRouter } from 'next/navigation';

export default function MyComponent({ student_name }: any) {
  const router = useRouter();

  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div>
        <div className="flex justify-end items-end">
          <Button
            className="font-medium m-2"
            size="sm"
            color="primary"
            onPress={() => {
              router.push('/responsible/trips');
            }}
          >
            Voltar
          </Button>
        </div>
        <Card>
          <CardBody>
            <div className="m-4 items-center">
              {student_name !== null ? (
                <h1 className={`text-lg text-center font-bold`}>
                  🤓 {student_name}
                </h1>
              ) : (
                <h1 className={`text-lg font-bold text-center text-gray-500`}>
                  Nenhuma viagem no momento.
                </h1>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
