import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invitation } from './entities/invitation.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
  ) {}

  async findAll(): Promise<Invitation[]> {
    return this.invitationRepository.find({
      relations: ['candidate'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Invitation> {
    return this.invitationRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async create(invitationData: Partial<Invitation>): Promise<Invitation> {
    const invitation = this.invitationRepository.create(invitationData);
    return this.invitationRepository.save(invitation);
  }
}
