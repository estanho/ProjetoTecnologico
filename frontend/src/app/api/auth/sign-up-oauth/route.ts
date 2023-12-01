import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getUser();

  const body = await request.json();

  const { name, cellphone, email, password, role, cnh, code } = body;

  let error = false;

  try {
    const { data: codeExists } = await supabase
      .from('students')
      .select('id, registered')
      .eq('code', code)
      .single();
    // Código errado
    if (
      (codeExists === null && role === 'StudentRole') ||
      codeExists?.registered === true
    ) {
      error = true;
      // Código correto
    } else {
      await supabase
        .from('users')
        .update({
          name,
          email,
          cellphone,
          role,
        })
        .eq('id', data.user?.id as string);

      let uid = data.user?.id;
      let claim = 'role';
      let value = role;

      await supabase.rpc('set_claim', {
        uid,
        claim,
        value,
      });

      await supabase.auth.refreshSession();

      if (role === 'DriverRole') {
        await supabase.from('drivers').insert({
          cnh,
          user_id: data.user?.id as string,
        });
      } else if (role === 'StudentRole') {
        await supabase
          .from('students')
          .update({
            registered: true,
            email: email,
            user_id: data.user?.id as string,
          })
          .eq('id', codeExists?.id);
      } else if (role === 'ResponsibleRole') {
        // Verifica se já existe o registro como responsible para esse novo usuario
        const { data: newData } = await supabase
          .from('responsibles')
          .select('email')
          .eq('email', email);
        // Se não exister, cria o perfil de responsible para esse novo usuario
        if (newData?.length === 0) {
          await supabase.from('responsibles').insert({
            email: email,
            registered: true,
            user_id: data.user?.id as string,
          });
          // Se já existe, atribui o perfil responsible ao novo usuario cadastrado
        } else {
          await supabase
            .from('responsibles')
            .update({
              registered: true,
              user_id: data.user?.id as string,
            })
            .eq('email', email);
        }
      } else {
        error = true;
      }
    }
  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false });
}
