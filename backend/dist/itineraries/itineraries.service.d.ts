import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
export declare class ItinerariesService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(user: UserFromJwt): Promise<{
        error: boolean;
    }>;
    update(user: UserFromJwt): Promise<{
        error: boolean;
    }>;
}
