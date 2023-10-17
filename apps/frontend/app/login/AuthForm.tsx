'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  supabase.auth.onAuthStateChange(async (event) => {
    if (event == 'SIGNED_IN') {
      router.push('/auth/callback');
    }
  });

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      providers={['google']}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email',
            email_input_placeholder: 'exemplo@gmail.com',
            password_label: 'Senha',
            password_input_placeholder: 'Sua senha',
            button_label: 'Entrar',
            social_provider_text: 'Continuar com o Google',
            link_text: 'Você já possui uma conta?',
          },
          forgotten_password: {
            email_label: 'Email',
            button_label: 'Resetar a senha',
            email_input_placeholder: 'exemplo@gmail.com',
            link_text: 'Você esqueceu a senha?',
            password_label: 'Senha',
          },
          sign_up: {
            email_label: 'Email',
            email_input_placeholder: 'exemplo@gmail.com',
            password_label: 'Crie sua senha',
            password_input_placeholder: 'Sua senha',
            button_label: 'Cadastrar',
            social_provider_text: 'Cadastrar com o Google',
            link_text: 'Você não possui uma conta?',
          },
        },
      }}
      redirectTo={`${window.location.origin}/auth/callback`}
    />
  );
}
