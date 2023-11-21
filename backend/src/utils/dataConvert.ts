import * as moment from 'moment';

export function stringToDate(data: any) {
  if ('morning_arrival' in data && data.morning_arrival !== null) {
    data.morning_arrival = moment(data.morning_arrival, 'HH:mm:ss').toDate();
    data.morning_arrival.setMonth(0);
    data.morning_arrival.setDate(1);
  }

  if ('morning_departure' in data && data.morning_departure !== null) {
    data.morning_departure = moment(
      data.morning_departure,
      'HH:mm:ss',
    ).toDate();
    data.morning_departure.setMonth(0);
    data.morning_departure.setDate(1);
  }
  if ('afternoon_arrival' in data && data.afternoon_arrival !== null) {
    data.afternoon_arrival = moment(
      data.afternoon_arrival,
      'HH:mm:ss',
    ).toDate();
    data.afternoon_arrival.setMonth(0);
    data.afternoon_arrival.setDate(1);
  }

  if ('afternoon_departure' in data && data.afternoon_departure !== null) {
    data.afternoon_departure = moment(
      data.afternoon_departure,
      'HH:mm:ss',
    ).toDate();
    data.afternoon_departure.setMonth(0);
    data.afternoon_departure.setDate(1);
  }
  if ('night_arrival' in data && data.night_arrival !== null) {
    data.night_arrival = moment(data.night_arrival, 'HH:mm:ss').toDate();
    data.night_arrival.setMonth(0);
    data.night_arrival.setDate(1);
  }

  if ('night_departure' in data && data.night_departure !== null) {
    data.night_departure = moment(data.night_departure, 'HH:mm:ss').toDate();
    data.night_departure.setMonth(0);
    data.night_departure.setDate(1);
  }

  return data;
}
