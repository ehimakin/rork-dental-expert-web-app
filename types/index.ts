export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface ConsultationDocument {
  id: string;
  name: string;
  uri: string;
  type: string;
  size: number;
}

export type ConsultationStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

export interface Consultation {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  caseDetails: string;
  documents: ConsultationDocument[];
  status: ConsultationStatus;
  createdAt: Date;
  scheduledDate?: Date;
}
