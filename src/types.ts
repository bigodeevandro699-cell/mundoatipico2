/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChildProfile {
  id: string;
  name: string;
  photoUrl: string;
  birthDate: string;
  age: number;
  interests: string[];
  skills: string[];
  challenges: string[];
  therapeuticObjectives: string[];
  sensoryPreferences: string[];
  generalObservations: string;
  points?: number;
  achievements?: string[];
}

export type ActivityCategory =
  | 'Comunicação'
  | 'Linguagem'
  | 'Coordenação motora fina'
  | 'Coordenação motora ampla'
  | 'Regulação emocional'
  | 'Habilidades sociais'
  | 'Atenção e concentração'
  | 'Alfabetização'
  | 'Matemática'
  | 'Estimulação sensorial'
  | 'Autonomia'
  | 'Vida diária'
  | 'Brincadeiras educativas'
  | 'Percepção visual'
  | 'Funções executivas'
  | 'Jogos educativos';

export interface Activity {
  id: string;
  title: string;
  description: string;
  therapeuticObjective: string;
  ageRange: string; // e.g. "3-5 anos", "6-8 anos"
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estimatedTime: string; // e.g. "15 min", "30 min"
  materialsNeeded: string[];
  stepByStep: string[];
  expectedBenefits: string[];
  extraTips: string;
  imageUrl?: string;
  videoUrl?: string; // opcional
  category: ActivityCategory;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

export interface RoutineTask {
  id: string;
  childId: string;
  title: string;
  time: string; // e.g. "08:00"
  pictogramName: string; // e.g. "brush_teeth", "breakfast", "shower"
  isCompleted: boolean;
  reminderEnabled: boolean;
}

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string; // ISO string or YYYY-MM-DD
  observedBehaviors: string[];
  emotionRating: 'calm' | 'happy' | 'stimulated' | 'agitated' | 'meltdown'; // regulação
  progressMade: string;
  challengesFaced: string;
  generalNotes: string;
}

export interface Appointment {
  id: string;
  childId: string;
  type: 'consulta' | 'terapia' | 'escola' | 'medicamento' | 'compromisso';
  title: string;
  description: string;
  dateTime: string; // ISO string/YYYY-MM-DDTHH:mm
  professionalName?: string;
  isCompleted: boolean;
}

export interface UserPreferences {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  highContrast: boolean;
  themeMode: 'light' | 'dark';
}
