export type ProfileMode = 'personal' | 'professional';

export type PersonalIntent = 'amistad' | 'citas' | 'conocer_gente' | 'actividades';
export type ProfessionalIntent = 'empleo' | 'clientes' | 'socios' | 'inversion' | 'colaboradores';

export type ContactType = 'phone' | 'instagram' | 'linkedin' | 'email' | 'telegram' | 'portfolio';

export interface ContactMethod {
  id: string;
  profileId: string;
  type: ContactType;
  value: string;
  label?: string;
  isPrivate: boolean;
}

export interface ProfileAnswer {
  category: 'intereses' | 'intencion' | 'estilo_vida' | 'habilidades' | 'ofrece_busca';
  key: string;
  values: string[];
  isComparableConsent: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  mode: ProfileMode;
  displayName: string;
  avatarUrl?: string;
  headline: string; // ej: "Amante del techno y la fotografía" o "Lead Dev & Fundador"
  bio?: string;
  intent: PersonalIntent | ProfessionalIntent;
  answers: ProfileAnswer[];
  contacts: ContactMethod[];
  createdAt: string;
}

export interface CategoryAffinity {
  category: string;
  title: string;
  score: number | null; // 0 - 100 o null si es insuficiente
  coverage: number;     // 0 - 100% de datos comparables
  status: 'optimal' | 'sufficient' | 'insufficient';
  explanation: string;
  highlights: string[];
}

export interface AffinityResult {
  overallScore: number | null;
  overallCoverage: number;
  dealbreakerConflict: boolean;
  categories: CategoryAffinity[];
  complementarityNotes?: string[];
}

export interface ExchangeSession {
  id: string;
  initiatorProfileId: string;
  joinerProfileId?: string;
  token: string;
  shortCode: string;
  mode: ProfileMode;
  initiatorConsent: boolean;
  joinerConsent: boolean;
  status: 'pending' | 'joined' | 'consented' | 'connected' | 'rejected' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export interface ContactGrant {
  id: string;
  connectionId: string;
  granterProfileId: string;
  contactMethod: ContactMethod;
  grantedAt: string;
  revokedAt?: string;
}

export interface PrivateNote {
  connectionId: string;
  authorProfileId: string;
  content: string;
  updatedAt: string;
}

export interface SavedConnection {
  id: string;
  sessionId: string;
  mode: ProfileMode;
  myProfileId: string;
  otherProfile: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    headline: string;
    intent: string;
  };
  metAtLocation?: string;
  metAtTimestamp: string;
  affinityResult: AffinityResult;
  contactsReceived: ContactMethod[];
  myGrantsGiven: string[]; // IDs de contactos que yo le di
  privateNote?: string;
}
