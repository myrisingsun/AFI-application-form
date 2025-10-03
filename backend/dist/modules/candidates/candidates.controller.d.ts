import { CandidatesService } from './candidates.service';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    findAll(): Promise<import("./entities/candidate.entity").Candidate[]>;
    findOne(id: string): Promise<import("./entities/candidate.entity").Candidate>;
    update(id: string, updateData: any): Promise<import("./entities/candidate.entity").Candidate>;
    remove(id: string): Promise<void>;
}
