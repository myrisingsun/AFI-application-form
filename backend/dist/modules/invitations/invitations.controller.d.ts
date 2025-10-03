import { InvitationsService } from './invitations.service';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    findAll(): Promise<import("./entities/invitation.entity").Invitation[]>;
    findOne(id: string): Promise<import("./entities/invitation.entity").Invitation>;
    create(createData: any): Promise<import("./entities/invitation.entity").Invitation>;
}
