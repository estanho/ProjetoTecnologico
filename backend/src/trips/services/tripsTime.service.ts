import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class TripTimeService {
  async checkIntervalTime(routes: any, return_trip: any) {
    // Soma do tempo de todos os trechos
    let totalDurationInSeconds = routes[0].legs.reduce(
      (total, leg) => total + leg.duration.value,
      0,
    );
    // Soma das distâncias de todos os trechos
    const totalDistanceInMeters = routes[0].legs.reduce(
      (total, leg) => total + leg.distance.value,
      0,
    );
    // Aplica mais 10 minutos (Prevenção de atrasos)
    totalDurationInSeconds = totalDurationInSeconds + 300;
    // Cria a duração total em milissegundos
    const totalDurationMoment = moment.duration(
      totalDurationInSeconds,
      'seconds',
    );
    // Converter a distância total para quilômetros
    const totalDistanceInKilometers = totalDistanceInMeters / 1000;
    // Exibi o tempo total em minutos
    const totalMinutes = totalDurationMoment.asMinutes();

    const return_time = moment(return_trip.times.estimated);
    const return_time_add = return_time
      .clone()
      .add(totalMinutes, 'minutes')
      .toDate();

    return {
      totalTravelTime: totalMinutes,
      return_time_add,
      totalKM: totalDistanceInKilometers,
    };
  }

  async checkTime(
    shift: string,
    type: string,
    routes: any,
    school: any,
    students_length: number,
  ) {
    try {
      if (type === 'going') {
        // Soma do tempo de todos os trechos
        let totalDurationInSeconds = routes[0].legs.reduce(
          (total, leg) => total + leg.duration.value,
          0,
        );
        // Soma das distâncias de todos os trechos
        const totalDistanceInMeters = routes[0].legs.reduce(
          (total, leg) => total + leg.distance.value,
          0,
        );
        // Aplica 2 min por student e mais 5 minutos (Prevenção de atrasos)
        totalDurationInSeconds =
          totalDurationInSeconds + students_length * 120 + 300;
        // Cria a duração total em milissegundos
        const totalDurationMoment = moment.duration(
          totalDurationInSeconds,
          'seconds',
        );
        // Converter a distância total para quilômetros
        const totalDistanceInKilometers = totalDistanceInMeters / 1000;

        // Criar um momento com o horário específico
        let specificTime: Date;

        if (shift === 'morning') {
          specificTime = school.morning_arrival;
        } else if (shift === 'afternoon') {
          specificTime = school.afternoon_arrival;
        } else {
          specificTime = school.night_arrival;
        }
        // Subtrai o horário específico da duração total
        const result = moment(specificTime).subtract(totalDurationMoment);
        // Exibir o tempo total em minutos
        const totalMinutes = totalDurationMoment.asMinutes();

        return {
          totalTravelTime: totalMinutes,
          estimated: result.toDate(),
          totalKM: totalDistanceInKilometers,
        };
      } else if (type === 'return') {
        // Soma do tempo de todos os trechos (Remove o ponto final)
        let totalDurationInSeconds = routes[0].legs
          .slice(0, -1)
          .reduce((total, leg) => total + leg.duration.value, 0);
        // Somar das distâncias de todos os trechos (Remove o ponto final)
        const totalDistanceInMeters = routes[0].legs
          .slice(0, -1)
          .reduce((total, leg) => total + leg.distance.value, 0);
        // Aplicar 2 min por aluno e mais 10 minutos (Prevenção de atrasos)
        totalDurationInSeconds =
          totalDurationInSeconds + students_length * 120 + 300;
        // Cria a duração total em milissegundos
        const totalDurationMoment = moment.duration(
          totalDurationInSeconds,
          'seconds',
        );
        // Converte a distância total para quilômetros
        const totalDistanceInKilometers = totalDistanceInMeters / 1000;

        let specificTime: Date;

        if (shift === 'morning') {
          specificTime = school.morning_departure;
        } else if (shift === 'afternoon') {
          specificTime = school.afternoon_departure;
        } else {
          specificTime = school.night_departure;
        }
        // Soma o horário específico da duração total
        const result = moment(specificTime).add(totalDurationMoment);
        // Exibir o tempo total em minutos
        const totalMinutes = totalDurationMoment.asMinutes();

        return {
          totalTravelTime: totalMinutes,
          estimated: result.toDate(),
          totalKM: totalDistanceInKilometers,
        };
      }
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async checkTimeMix(
    type: string,
    routes: any,
    school_return: any,
    students_length: number,
  ) {
    try {
      // Somar as durações de todos os trechos
      let totalDurationInSeconds = routes[0].legs.reduce(
        (total, leg) => total + leg.duration.value,
        0,
      );
      // Somar as distâncias de todos os trechos
      const totalDistanceInMeters = routes[0].legs.reduce(
        (total, leg) => total + leg.distance.value,
        0,
      );
      // Aplicar 2 min por aluno e mais 10 minutos (Prevenção de atrasos)
      totalDurationInSeconds =
        totalDurationInSeconds + students_length * 120 + 300;
      // Criar um momento com a duração total em milissegundos
      const totalDurationMoment = moment.duration(
        totalDurationInSeconds,
        'seconds',
      );
      // Converter a distância total para quilômetros
      const totalDistanceInKilometers = totalDistanceInMeters / 1000;

      let specificTime: Date;
      // Criar um momento com o horário específico
      if (type === 'morning_afternoon') {
        specificTime = school_return.morning_departure;
      } else if (type === 'afternoon_night') {
        specificTime = school_return.afternoon_departure;
      }

      // Adiciona o horário específico da duração total
      const result = moment(specificTime).add(totalDurationMoment);
      // Exibi o tempo total em minutos
      const totalMinutes = totalDurationMoment.asMinutes();
      return {
        totalTravelTime: totalMinutes,
        estimated: result.toDate(),
        totalKM: totalDistanceInKilometers,
      };
    } catch (error) {
      return { error: true, message: error };
    }
  }
}
