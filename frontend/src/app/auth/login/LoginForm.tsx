'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Link,
} from '@nextui-org/react';
import Messages from '../../../components/Messages';
import { useSupabase } from '../../ProviderSupabase';

export default function SignupForm() {
  const { supabase } = useSupabase();

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-xl w-full">
        <CardHeader className="justify-center">
          <p className="text-xl">Login</p>
        </CardHeader>
        <Divider />
        <CardBody className="p-12">
          <form
            className="flex-1 flex flex-col w-full justify-center"
            action="/api/auth/sign-in"
            method="post"
          >
            <Messages />

            <Input
              className="mb-6 mt-6"
              size="md"
              type="email"
              name="email"
              variant="faded"
              label="Email"
              labelPlacement="outside"
              placeholder="Digite seu email aqui"
              isRequired
            />
            <Input
              className="mb-6"
              type="password"
              name="password"
              variant="faded"
              label="Senha"
              labelPlacement="outside"
              placeholder="Senha"
              isRequired
              isClearable
            />

            <Button type="submit" color="primary" variant="shadow">
              Entrar
            </Button>

            <p className="mx-auto mt-4">ou</p>

            <Button
              className="mt-4"
              color="secondary"
              variant="shadow"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/api/auth/callback/`,
                  },
                })
              }
            >
              Continuar com Google
            </Button>

            <Link href="/auth/signup" className="mx-auto mt-10">
              Você não possui conta? Faça o cadastro
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
