import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../database/prisma.service';
import { DirectionsService } from '../maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      await this.directionsService.getDirections(
        createRouteDto.source_id,
        createRouteDto.destination_id,
      );

    const legs = routes[0].legs[0];

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          create: {
            place_id: createRouteDto.source_id,
            name: legs.start_address,
            latitude: legs.start_location.lat,
            longitude: legs.start_location.lng,
          },
        },
        destination: {
          create: {
            place_id: createRouteDto.destination_id,
            name: legs.end_address,
            latitude: legs.end_location.lat,
            longitude: legs.end_location.lng,
          },
        },
        distance: legs.distance.value,
        duration: legs.duration.value,
        directions: JSON.stringify({
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
        }),
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
        source: true,
        destination: true,
        distance: true,
        duration: true,
        directions: true,
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
