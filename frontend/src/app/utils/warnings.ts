import toast from 'react-hot-toast';

export function errorControl(error: string) {
  let message;

  switch (error) {
    case 'no_trip':
      message =
        'A viagem não foi encontrada, por favor tente recarregar a página.';
      break;
    default:
      message = 'Ocorreu um erro. 😥';
      break;
  }
  toast.error(message);
}

export function startNotice() {
  toast(
    `As viagens de hoje já começaram... e por esse motivo não é possível 
    alterar os dados dos alunos por enquanto. Finalize as viagens de hoje 
    para conseguir alterar as informações dos alunos.`,
    {
      duration: 10000,
      icon: '🚐',
      position: 'bottom-left',
    },
  );
}
