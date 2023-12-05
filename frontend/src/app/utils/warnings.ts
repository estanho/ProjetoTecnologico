import toast from 'react-hot-toast';

export function errorControl(error: string) {
  let message;

  switch (error) {
    case 'no_driver':
      message =
        'Ocorreu um erro. O motorista não foi encontrado, por favor tente recarregar a página 😥';
      break;
    case 'no_itinerary':
      message =
        'Ocorreu um erro. O itinerário não foi encontrado, por favor tente recarregar a página 😥';
      break;
    case 'no_student':
      message =
        'Ocorreu um erro. O estudante não foi encontrado, por favor tente recarregar a página 😥';
      break;
    case 'no_trip':
      message =
        'Ocorreu um erro. A viagem não foi encontrada, por favor tente recarregar a página 😥';
      break;
    case 'trips_or_itinerary_error':
      message = 'Ocorreu um erro ao tentar criar a viagem 😥';
      break;
    case 'trips_error':
      message = 'Ocorreu um erro ao tentar criar a viagem 😥';
      break;
    case 'no_studentTrip':
      message = 'Ocorreu um erro. A viagem do estudante não foi encontrada 😥';
      break;
    case 'no_responsible':
      message = 'Ocorreu um erro. O responsável não foi encontrado 😥';
      break;
    default:
      message = 'Ocorreu um erro, por favor tente recarregar a página 😥';
      break;
  }
  toast.error(message, {
    duration: 7000,
  });
}

export function startNotice() {
  toast(
    `As viagens de hoje já começaram... e por esse motivo não é possível 
    alterar os dados por enquanto. Finalize as viagens de hoje 
    para conseguir alterar as informações.`,
    {
      duration: 10000,
      icon: '🚐',
      position: 'bottom-left',
    },
  );
}
