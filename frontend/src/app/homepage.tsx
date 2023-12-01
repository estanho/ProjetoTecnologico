'use client';

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Divider,
  Button,
} from '@nextui-org/react';
import React from 'react';

export default function Homepage() {
  const notifications = [
    'Estudante André marcado como PRESENTE na IDA por Lucas',
    'Estudante Filipe marcado como AUSENTE na IDA por Andrius',
    'Estudante Wesley marcado como PRESENTE na VOLTA por Robson',
    'Estudante Rafael marcado como AUSENTE na VOLTA por Leonardo',
    'Estudante Pedro embarcou no transporte do motorista Marco',
    'Estudante Pietro desembarcou do transporte do motorista Thiago',
  ];

  function getString(notifications: string[]): string {
    const index = Math.floor(Math.random() * notifications.length);
    return notifications[index];
  }

  return (
    <div className="m-4">
      <div className="flex flex-col items-center justify-center mt-32">
        <div className="max-w-screen-sm w-full items-center">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Bem Vindo a plataforma Microrota
          </h1>
          <div className="text-justify">
            <div className="flex items-center justify-center">
              <Image alt="Capa" isBlurred width={500} src="/cover.png" />
            </div>
            <h1 className="mt-8 text-md font-bold mb-4">Projeto</h1>
            <p className="mt-4 mb-2">
              A plataforma <strong>'Microrota'</strong> é um projeto tecnológico
              dedicado à gestão eficiente do transporte escolar, com foco na
              assistência tanto aos motoristas quanto aos responsáveis e
              estudantes.
            </p>
            <p className="mb-2">
              O aplicativo, especialmente desenvolvido para os motoristas,
              apresenta recursos avançados, incluindo a visualização dos alunos
              cadastrados e das escolas, simplificando a identificação e
              organização dos embarques e desembarques. Além disso, o sistema
              abrange um controle automatizado de presença e notificações em
              tempo real, otimizando o processo de gestão do transporte escolar.
            </p>
            <p className="mb-8">
              Importante ressaltar que tanto os responsáveis quanto os
              estudantes têm acesso ao mapa interativo que exibe a localização
              do motorista durante as viagens.
            </p>
            <h1 className="text-md font-bold mb-4">Versão Mobile com PWA</h1>
            <p className="mb-2">
              A plataforma foi desenvolvida pensando na possibilidade de ser
              utilizada em dispositivos móveis. Optou-se por desenvolver o
              aplicativo como um Progressive Web App (PWA). Isso proporciona uma
              experiência semelhante a um aplicativo nativo, permitindo que os
              usuários instalem o aplicativo diretamente do navegador,
              eliminando a necessidade de downloads por meio de lojas de
              aplicativos.
            </p>
            <small>
              (Opcional) Para instalar: Acesse as três bolinhas no canto
              superior direito do navegador e selecione a opção de 'Instalar
              aplicativo'.
            </small>
            <h1 className="text-md font-bold mb-4 mt-8">Notificações e GPS</h1>
            <p className="mb-2">
              A plataforma utiliza o sistema de geolocalização e notificações do
              navegador de internet. Para que tudo funcione corretamente o
              usuário deve dar acesso aos recursos do navegador para a
              plataforma.
            </p>
            <small>
              A plataforma irá solicitar acesso para exibir notificações e
              acessar a localização do usuário quando necessário.
            </small>
            <div className="mt-4 text-center space-x-2">
              <h1 className="mb-4 font-semibold">Teste de notificação:</h1>
              <Button
                color="primary"
                className="font-semibold"
                onClick={async () => {
                  await window.Notification.requestPermission((permission) => {
                    if (permission === 'granted') {
                      new window.Notification('Microrota', {
                        body: getString(notifications),
                        icon: './icons/icon-192x192.png',
                      });
                    }
                  });
                }}
              >
                Notificação
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <Tabs aria-label="Opções" color="primary" className="w-full">
              <Tab key="all" title="Microrota">
                <Card>
                  <CardBody className="bg-gray-100">
                    <div className="text-justify">
                      <p>
                        A plataforma <strong>'Microrota'</strong> gera rotas
                        automaticamente ao cadastrar estudantes e escolas. No
                        entanto, algumas limitações devem ser consideradas.
                      </p>
                      <p className="m-2">
                        • A plataforma suporta apenas uma escola por turno
                        (manhã, tarde e noite). O sistema tenta gerar rotas
                        considerando ida e volta, mesclando embarques e
                        desembarques quando necessário.
                      </p>
                      <p className="m-2">
                        • Após o início das viagens, a plataforma bloqueia
                        alterações nas informações de alunos e escolas para
                        garantir a consistência e segurança das rotas.
                      </p>
                      <p className="m-6 text-center font-semibold">
                        ⚠️ Os dados apresentados nas imagens dos perfis são
                        todos fictícios! ⚠️
                      </p>
                      <p className="font-light mt-8 text-center">
                        Contato:{' '}
                        <a
                          href="mailto:estanhoeu@rede.ulbra.br"
                          className="text-blue-600"
                        >
                          estanhoeu@rede.ulbra.br
                        </a>
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="driver" title="Motorista">
                <Card>
                  <CardBody className="bg-gray-100">
                    <div className="text-justify">
                      <p className="mb-4">
                        O <strong>motorista</strong> desempenha um papel
                        fundamental na 'Microrota', com acesso a funcionalidades
                        que simplificam e otimizam a rotina.
                      </p>
                      <p>
                        • Na página de cadastro, o motorista pode inserir
                        informações cruciais sobre alunos e escolas, incluindo
                        detalhes como turnos, horários e endereços.
                      </p>
                      <p className="m-2">
                        • Na Lista de alunos é possível visualizar as
                        informações detalhadas dos alunos e um botão para abrir
                        diretamente o aplicativo WhatsApp do responsável
                        registrado.
                      </p>
                      <p className="m-2">
                        • Na lista de Escolas é possível desativar e ativar a
                        escola caso seja necessário.
                      </p>
                      <p className="mb-2">
                        • A tela de notificações mantém o motorista informado
                        sobre ausências de alunos, enquanto a tela de roteiro
                        oferece uma visão detalhada das viagens realizadas no
                        dia.
                      </p>
                      <p>
                        • O mapa interativo exibe a localização dos alunos e
                        escolas, indicando a ordem de embarque e desembarque.
                      </p>
                      <h1 className="mt-8 text-lg font-bold mb-8 text-center">
                        Imagens
                      </h1>
                      <div className="flex flex-col items-center justify-center mb-4">
                        <Image
                          alt="Criação de Estudante"
                          isBlurred
                          width={400}
                          src="/driver/create_student.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/driver/create_school.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/school_list.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/student_list.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/info_student.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/driver/notification_driver.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/trips_list.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/map_driver1.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/driver/map_driver2.png"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="student" title="Estudante">
                <Card>
                  <CardBody className="bg-gray-100">
                    <div className="text-justify">
                      <p className="mb-4">
                        Para os <strong>estudantes</strong>, a 'Microrota'
                        simplifica o processo de transporte escolar.
                      </p>
                      <p className="mb-4">
                        • Após o cadastro pelo motorista, um código exclusivo é
                        gerado para cada estudante, utilizado durante o processo
                        de inscrição.
                      </p>
                      <p className="mb-4">
                        • O perfil de estudantes proporciona acesso a
                        notificações de embarque e desembarque, além de um
                        histórico detalhado das viagens. Quando o estudante está
                        em uma viagem ativa, é possível visualizar a posição da
                        van escolar em tempo real por meio do mapa interativo.
                      </p>
                      <h1 className="mt-8 text-lg font-bold mb-8 text-center">
                        Imagens
                      </h1>
                      <div className="flex flex-col items-center justify-center mb-4">
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/students/map_student.png"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="responsible" title="Responsável">
                <Card>
                  <CardBody className="bg-gray-100">
                    <div className="text-justify">
                      <p className="mb-4">
                        Assim como o estudante, o <strong>responsável</strong>{' '}
                        tem acesso a notificações e ao roteiro com a localização
                        do motorista.
                      </p>
                      <p className="mb-4">
                        • O cadastro do responsável é facilitado pelo motorista
                        na tela de estudantes, onde o e-mail é registrado. O
                        responsável pode se cadastrar usando o mesmo e-mail,
                        permitindo acesso às informações do aluno. É possível
                        ter mais de um responsável cadastrado por estudante.
                      </p>
                      <h1 className="mt-8 text-lg font-bold mb-8 text-center">
                        Imagens
                      </h1>
                      <div className="flex flex-col items-center justify-center mb-4">
                        <Image
                          alt="Lista de Escolas"
                          isBlurred
                          width={400}
                          src="/responsibles/account.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/responsibles/map_responsible.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/responsibles/notification_responsible.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/responsibles/trips_list2.png"
                        />
                        <Divider className="mb-4 mt-4" />
                        <Image
                          alt="Criação de Escola"
                          isBlurred
                          width={400}
                          src="/responsibles/trips_list3.png"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
          <div className="mt-32 p-8 text-center font-semibold text-gray-400">
            Microrota 2023
          </div>
        </div>
      </div>
    </div>
  );
}
