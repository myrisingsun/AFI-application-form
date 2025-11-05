import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export const registerSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  role: z.enum(['admin', 'recruiter']),
})

// Invitation schema
export const invitationSchema = z.object({
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  middleName: z.string().optional(),
  email: z.string().email('Некорректный email адрес'),
  phone: z.string().regex(/^\\+?[1-9]\\d{1,14}$/, 'Некорректный номер телефона'),
})

// Questionnaire validation schemas
export const passportSchema = z.object({
  series: z.string().regex(/^\\d{4}$/, 'Серия паспорта должна содержать 4 цифры'),
  number: z.string().regex(/^\\d{6}$/, 'Номер паспорта должен содержать 6 цифр'),
  issuedBy: z.string().min(5, 'Поле "Кем выдан" обязательно для заполнения'),
  issueDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата'),
  subdivisionCode: z.string().regex(/^\\d{3}-\\d{3}$|^\\d{6}$/, 'Код подразделения должен быть в формате XXX-XXX или XXXXXX'),
})

export const innSchema = z.string().regex(/^\\d{12}$/, 'ИНН должен содержать 12 цифр')

export const snilsSchema = z.string().regex(/^\\d{3}-\\d{3}-\\d{3} \\d{2}$|^\\d{11}$/, 'СНИЛС должен быть в формате XXX-XXX-XXX XX или содержать 11 цифр')

export const phoneSchema = z.string().regex(/^\\+?[1-9]\\d{1,14}$/, 'Некорректный номер телефона')

// Family member schema
export const familyMemberSchema = z.object({
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата'),
  workplace: z.string().min(2, 'Место работы обязательно для заполнения'),
  position: z.string().min(2, 'Должность обязательна для заполнения'),
  relationship: z.string().min(2, 'Степень родства обязательна для заполнения'),
})

// Education schema
export const educationSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата начала'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата окончания'),
  institution: z.string().min(3, 'Наименование учебного заведения обязательно'),
  specialization: z.string().min(3, 'Специальность обязательна для заполнения'),
  type: z.enum(['primary', 'additional']),
})

// Work experience schema
export const workExperienceSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата начала'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата окончания'),
  company: z.string().min(3, 'Наименование организации обязательно'),
  position: z.string().min(2, 'Должность обязательна для заполнения'),
  reasonForLeaving: z.string().min(3, 'Причина увольнения обязательна'),
  phone: phoneSchema,
})

// Reference schema
export const referenceSchema = z.object({
  fullName: z.string().min(2, 'ФИО обязательно для заполнения'),
  workplace: z.string().min(3, 'Место работы обязательно'),
  position: z.string().min(2, 'Должность обязательна'),
  phone: phoneSchema,
})

// Complete questionnaire schema
export const questionnaireSchema = z.object({
  // General information
  desiredPosition: z.string().min(2, 'Желаемая должность обязательна'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата рождения'),
  birthPlace: z.string().min(3, 'Место рождения обязательно'),
  previousLastName: z.string().optional(),
  nameChangeDate: z.string().optional(),
  nameChangeReason: z.string().optional(),

  // Addresses
  registrationAddress: z.string().min(10, 'Адрес регистрации обязателен'),
  actualAddress: z.string().optional(),

  // Documents
  passportSeries: z.string().regex(/^\\d{4}$/, 'Серия паспорта должна содержать 4 цифры'),
  passportNumber: z.string().regex(/^\\d{6}$/, 'Номер паспорта должен содержать 6 цифр'),
  passportIssuedBy: z.string().min(5, 'Поле "Кем выдан" обязательно'),
  passportIssueDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Некорректная дата выдачи'),
  passportSubdivisionCode: z.string().regex(/^\\d{3}-\\d{3}$|^\\d{6}$/, 'Код подразделения в формате XXX-XXX'),
  inn: innSchema,
  snils: snilsSchema,

  // Family
  maritalStatus: z.string().min(2, 'Семейное положение обязательно'),
  familyMembers: z.array(familyMemberSchema).optional(),

  // Education (at least one required)
  education: z.array(educationSchema).min(1, 'Необходимо указать минимум одно образование'),

  // Languages
  languages: z.array(z.object({
    language: z.string().min(2, 'Название языка обязательно'),
    level: z.enum(['none', 'basic', 'intermediate', 'fluent']),
  })).optional(),

  // Work experience
  workExperience: z.array(workExperienceSchema),

  // References
  references: z.array(referenceSchema),

  // Additional information
  isEntrepreneur: z.boolean(),
  entrepreneurDetails: z.string().optional(),
  drivingLicense: z.string().optional(),
  drivingCategories: z.string().optional(),
  drivingExperience: z.string().optional(),
  medicalDispensary: z.boolean(),
  criminalRecord: z.boolean(),
  criminalDetails: z.string().optional(),
  hasRelativesInCompany: z.boolean(),
  relativesInCompanyDetails: z.string().optional(),

  // Consents (required)
  dataProcessingConsent: z.boolean().refine((val) => val === true, 'Согласие на обработку данных обязательно'),
  backgroundCheckConsent: z.boolean().refine((val) => val === true, 'Согласие на проверку СБ обязательно'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type InvitationFormData = z.infer<typeof invitationSchema>
export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>