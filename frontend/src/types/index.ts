// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'recruiter' | 'security' | 'viewer'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Candidate types
export enum CandidateStatus {
  DRAFT = 'draft',
  QUESTIONNAIRE_SUBMITTED = 'questionnaire_submitted',
  SECURITY_CHECK_PENDING = 'security_check_pending',
  SECURITY_CHECK_APPROVED = 'security_check_approved',
  SECURITY_CHECK_REJECTED = 'security_check_rejected',
  DOCUMENTS_PENDING = 'documents_pending',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  READY_FOR_1C = 'ready_for_1c',
  TRANSFERRED_TO_1C = 'transferred_to_1c',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  status: CandidateStatus
  invitationToken?: string
  invitationExpiresAt?: string
  documentsToken?: string
  documentsExpiresAt?: string
  securityCheckComment?: string
  metadata?: Record<string, any>
  questionnaire?: Questionnaire
  createdAt: string
  updatedAt: string
}

// Questionnaire types
export interface FamilyMember {
  fullName: string
  birthDate: string
  workplace: string
  position: string
  relationship: string
}

export interface Education {
  startDate: string
  endDate: string
  institution: string
  specialization: string
  type: 'primary' | 'additional'
}

export interface Language {
  language: string
  level: 'none' | 'basic' | 'intermediate' | 'fluent'
}

export interface WorkExperience {
  startDate: string
  endDate: string
  company: string
  position: string
  reasonForLeaving: string
  phone: string
}

export interface Reference {
  fullName: string
  workplace: string
  position: string
  phone: string
}

export interface Questionnaire {
  id: string
  candidateId: string

  // General Information
  desiredPosition: string
  birthDate: string
  birthPlace: string
  previousLastName?: string
  nameChangeDate?: string
  nameChangeReason?: string

  // Addresses
  registrationAddress: string
  actualAddress?: string

  // Documents
  passportSeries: string
  passportNumber: string
  passportIssuedBy: string
  passportIssueDate: string
  passportSubdivisionCode: string
  inn: string
  snils: string

  // Family
  maritalStatus: string
  familyMembers?: FamilyMember[]

  // Education
  education: Education[]

  // Languages
  languages?: Language[]

  // Work Experience
  workExperience: WorkExperience[]

  // References
  references: Reference[]

  // Additional Information
  isEntrepreneur: boolean
  entrepreneurDetails?: string
  drivingLicense?: string
  drivingCategories?: string
  drivingExperience?: string
  medicalDispensary: boolean
  criminalRecord: boolean
  criminalDetails?: string
  hasRelativesInCompany: boolean
  relativesInCompanyDetails?: string

  // Consents
  dataProcessingConsent: boolean
  backgroundCheckConsent: boolean
  consentTimestamp?: string
  consentIpAddress?: string
  consentUserAgent?: string

  isDraft: boolean
  createdAt: string
  updatedAt: string
}

// Invitation types
export enum InvitationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  OPENED = 'opened',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export interface Invitation {
  id: string
  candidateId: string
  token: string
  expiresAt: string
  status: InvitationStatus
  sentAt?: string
  openedAt?: string
  completedAt?: string
  revokedAt?: string
  ipAddress?: string
  userAgent?: string
  candidate?: Candidate
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
  role: User['role']
}

export interface InvitationForm {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
}