import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
export declare class InvitationsService {
    private invitationRepository;
    constructor(invitationRepository: Repository<Invitation>);
    findAll(): Promise<Invitation[]>;
    findOne(id: string): Promise<Invitation>;
    create(invitationData: Partial<Invitation>): Promise<Invitation>;
}
