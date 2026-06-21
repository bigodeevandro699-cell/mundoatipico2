/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent startup crashes if GEMINI_API_KEY is not defined.
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error('GEMINI_API_KEY is missing or unconfigured. Please add it in Settings > Secrets.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Global mockup in-memory database to simulate a dynamic Firestore setup for direct persistence in session!
const DATABASE = {
  profiles: [] as any[],
  routine: [] as any[],
  diary: [] as any[],
  appointments: [] as any[],
  customActivities: [] as any[],
};

// Seed Defaults
const DEFAULT_ROUTINE = [
  { id: 'rem-1', childId: 'main-child-id', title: 'Acordar e escovar os dentes', time: '08:00', pictogramName: '🦷', isCompleted: false, reminderEnabled: true },
  { id: 'rem-2', childId: 'main-child-id', title: 'Tomar café da manhã', time: '08:30', pictogramName: '🍞', isCompleted: false, reminderEnabled: true },
  { id: 'rem-3', childId: 'main-child-id', title: 'Atividade sensorial divertida', time: '10:00', pictogramName: '🎨', isCompleted: false, reminderEnabled: false },
  { id: 'rem-4', childId: 'main-child-id', title: 'Almoço nutritivo', time: '12:30', pictogramName: '🍛', isCompleted: false, reminderEnabled: true },
  { id: 'rem-5', childId: 'main-child-id', title: 'Soneca ou descanso', time: '14:00', pictogramName: '🛌', isCompleted: false, reminderEnabled: false },
  { id: 'rem-6', childId: 'main-child-id', title: 'Banho aconchegante', time: '18:00', pictogramName: '🛁', isCompleted: false, reminderEnabled: true },
];

const DEFAULT_APPOINTMENTS = [
  { id: 'ap-1', childId: 'main-child-id', type: 'terapia', title: 'Terapia Ocupacional', description: 'Trabalho de integração sensorial na Clínica Crescer', dateTime: '2026-06-22T14:30', professionalName: 'Dra. Marina Camargo (TO)', isCompleted: false },
  { id: 'ap-2', childId: 'main-child-id', type: 'terapia', title: 'Fonoaudiologia', description: 'Prática de comunicação pragmática e fonoarticulação', dateTime: '2026-06-23T10:00', professionalName: 'Dra. Sandra Lopes (Fono)', isCompleted: false },
  { id: 'ap-3', childId: 'main-child-id', type: 'medicamento', title: 'Vitaminas e Suplementos', description: 'Diluir suplemento em suco da manhã', dateTime: '2026-06-20T09:00', professionalName: 'Nutricionista Infantil', isCompleted: true },
  { id: 'ap-4', childId: 'main-child-id', type: 'consulta', title: 'Pediatra de Desenvolvimento', description: 'Consulta semestral de rotina para avaliação', dateTime: '2026-06-26T16:00', professionalName: 'Dr. Roberto Mendes', isCompleted: false },
];

// Initialize Firebase Web SDK server-side securely
let firebaseApp: any = null;
let db: any = null;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  let config: any = null;

  if (process.env.FIREBASE_CONFIG) {
    try {
      config = JSON.parse(process.env.FIREBASE_CONFIG);
      console.log('[Mundo Atípico Firebase] Inicializando do ambiente (FIREBASE_CONFIG env)...');
    } catch (err: any) {
      console.error('[Mundo Atípico Firebase error] Variável de ambiente FIREBASE_CONFIG inválida:', err.message);
    }
  }

  if (!config && fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log('[Mundo Atípico Firebase] Inicializando de firebase-applet-config.json local...');
  }

  if (config) {
    firebaseApp = initializeApp(config);
    const databaseId = config.firestoreDatabaseId || '(default)';
    db = getFirestore(firebaseApp, databaseId);
    console.log(`[Mundo Atípico Firebase] Armazenamento Firestore (${databaseId}) inicializado com sucesso.`);
  } else {
    console.warn('[Mundo Atípico Firebase warning] Nenhuma configuração encontrada (arquivo ou env). Usando banco de dados local temporário.');
  }
} catch (e: any) {
  console.warn('[Mundo Atípico Firebase warning] Falha ao inicializar o Firestore. Executando em modo local resiliente. Detalhes:', e.message || e);
}

// Helper to fetch from Firebase or return DATABASE fallback with automatic seeding
async function getCollectionDocs(collectionName: string, defaults?: any[]): Promise<any[]> {
  if (!db) return DATABASE[collectionName as keyof typeof DATABASE] || [];
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && defaults && defaults.length > 0) {
      console.log(`[Firebase seed] A coleção ${collectionName} está vazia. Semeando dados padrão...`);
      for (const item of defaults) {
        await setCollectionDoc(collectionName, item.id, item);
      }
      (DATABASE as any)[collectionName] = defaults;
      return defaults;
    }
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // update local cache
    (DATABASE as any)[collectionName] = docs;
    return docs;
  } catch (err: any) {
    console.warn(`[Firebase warning] Falha ao ler coleção ${collectionName}. Usando cache local.`, err.message || err);
    return DATABASE[collectionName as keyof typeof DATABASE] || [];
  }
}

async function setCollectionDoc(collectionName: string, docId: string, data: any) {
  if (!db) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (err: any) {
    console.warn(`[Firebase warning] Falha ao escrever documento ${docId} na coleção ${collectionName}.`, err.message || err);
  }
}

async function deleteCollectionDoc(collectionName: string, docId: string) {
  if (!db) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn(`[Firebase warning] Falha ao deletar documento ${docId} da coleção ${collectionName}.`, err.message || err);
  }
}

// ---- API IMPLEMENTATION ----

// Helper to handle robust retries with exponential backoff for temporary 503/429 errors from GenAI
async function generateContentWithRetry(aiClient: GoogleGenAI, params: any, retries = 3, delayMs = 1500): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (err: any) {
      const status = err.status || err.statusCode;
      const msg = (err.message || "").toLowerCase();
      const is503 = status === 503 || msg.includes('503') || msg.includes('unavailable') || msg.includes('high demand') || msg.includes('spike');
      const is429 = status === 429 || msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('rate limit');
      
      if ((is503 || is429) && attempt < retries) {
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini Resiliency Warning] Request failed on attempt ${attempt}/${retries} (temporary busy status). Retrying in ${backoffDelay}ms... Details: ${err.message || err}`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw err;
    }
  }
}

// Real intelligence activity generator endpoint powered by Gemini AI!
app.post('/api/recommendations', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Perfil de criança inválido para recomendação.' });
    }

    const aiClient = getGeminiClient();

    const systemPrompt = `Você é uma equipe integrada de elite para autismo infantil: Pedagogo especializado em TEA, Terapeuta Ocupacional, Cientista Comportamental Aplicado (ABA) e Psicólogo Infantil.
Sua missão é deduzir e inventar exatamente 3 atividades terapêuticas práticas, sob medida e totalmente estruturadas, projetadas especificamente para uma criança atpica com os parâmetros fornecidos.

A saída DEVE ser estritamente em formato JSON estruturado, traduzida em Português brasileiro.
Retorne um objeto do tipo Array de atividades. Cada atividade deve corresponder a uma destas 16 categorias de forma adequada:
'Comunicação', 'Linguagem', 'Coordenação motora fina', 'Coordenação motora ampla', 'Regulação emocional', 'Habilidades sociais', 'Atenção e concentração', 'Alfabetização', 'Matemática', 'Estimulação sensorial', 'Autonomia', 'Vida diária', 'Brincadeiras educativas', 'Percepção visual', 'Funções executivas', 'Jogos educativos'.

Exponha benefícios reais, passo a passo cuidadoso e adaptado a TEA, indicações sensoriais e dicas para os pais praticarem em casa sem sobrecarga.`;

    const userPrompt = `Gerar 3 atividades terapêuticas para:
Nome da Criança: ${profile.name}
Idade: ${profile.age} anos
Interesses: ${JSON.stringify(profile.interests)}
Habilidades: ${JSON.stringify(profile.skills)}
Desafios e dificuldades no cotidiano: ${JSON.stringify(profile.challenges)}
Objetivos Terapêuticos Principais: ${JSON.stringify(profile.therapeuticObjectives)}
Preferências sensoriais: ${JSON.stringify(profile.sensoryPreferences)}
Observações de apoio: ${profile.generalObservations || "Nenhuma registrada"}`;

    const response = await generateContentWithRetry(aiClient, {
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título amoroso, criativo e claro da atividade.' },
              description: { type: Type.STRING, description: 'O que é a brincadeira em uma frase acolhedora.' },
              therapeuticObjective: { type: Type.STRING, description: 'Qual o objetivo clínico ou pedagógico primordial.' },
              ageRange: { type: Type.STRING, description: 'Faixa etária sugerida (ex: 3 a 5 anos).' },
              difficulty: { type: Type.STRING, description: 'Dificuldade: Fácil, Médio ou Difícil.' },
              estimatedTime: { type: Type.STRING, description: 'Tempo sugerido (ex: 15 min).' },
              materialsNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Materiais caseiros simples necessários.'
              },
              stepByStep: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Passo a passo sequencial, dividido em microetapas claras.'
              },
              expectedBenefits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Quais os benefícios esperados no desenvolvimento.'
              },
              extraTips: { type: Type.STRING, description: 'Dicas cruciais para pais ou terapeutas, incluindo manejo ecológico se houver recusa.' },
              category: {
                type: Type.STRING,
                description: 'A categoria exata da lista de 16 categorias fornecidas.'
              }
            },
            required: [
              'title',
              'description',
              'therapeuticObjective',
              'ageRange',
              'difficulty',
              'estimatedTime',
              'materialsNeeded',
              'stepByStep',
              'expectedBenefits',
              'extraTips',
              'category'
            ]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Falha na resposta do modelo inteligente do Gemini.');
    }

    const activities = JSON.parse(textOutput);
    // Add unique IDs to the generated activities
    const activitiesWithIds = activities.map((act: any, idx: number) => ({
      ...act,
      id: `ai-gen-${Date.now()}-${idx}`,
      isFavorite: false,
      isCompleted: false
    }));

    res.json({ activities: activitiesWithIds });
  } catch (err: any) {
    console.info(`[Gemini Resiliency Info] API busy/unavailable. Successfully triggered clinical fallback library. Details: ${err.message || err}`);
    // Friendly, robust clinical back-up recommendation in case the API key is not configured yet!
    // This provides a smooth user experience and high professional execution value.
    res.json({
      error: err.message,
      usingFallback: true,
      activities: [
        {
          id: `ai-gen-fallback-1`,
          title: `Circuito de Saltos Amortecidos para ${req.body.profile?.name || 'Criança'}`,
          description: `Uma pista de almofadas no chão para pular e amortecer a queda de forma segura e ritmada.`,
          therapeuticObjective: `Regulação proprioceptiva e gasto energético estruturado, incentivando o equilíbrio de suporte.`,
          ageRange: `${req.body.profile?.age || 4} anos`,
          difficulty: 'Fácil',
          estimatedTime: '15 min',
          materialsNeeded: ['Almofadas macias de vários tamanhos', 'Tapete antiderrapante', 'Brinquedos leves para transportar'],
          stepByStep: [
            'Arrume 3 ou 4 almofadas firmes em fila sobre o tapete.',
            'Pegue um brinquedo favorito da criança e posicione do outro lado do circuito.',
            'Peça para a criança pular de almofada em almofada para "salvar" o brinquedo.',
            'Auxilie segurando pelas mãos se ela demonstrar receio físico.',
            'Agradeça e elogie o resgate a cada ciclo!'
          ],
          expectedBenefits: [
            'Ajuda no processamento proprioceptivo e acalento do tônus muscular',
            'Trabalha folego e limites espaciais corporais',
            'Facilita a modulação emocional através do descarrego físico'
          ],
          extraTips: `Essa atividade é excelente para descarregar tensões e conter momentos de agitação motora fina.`,
          category: 'Coordenação motora ampla',
          isFavorite: false,
          isCompleted: false
        },
        {
          id: `ai-gen-fallback-2`,
          title: `Caça-Palavras com Gel de Barbear ou Espuma`,
          description: `Escrever letras ou números no vidro box do banheiro ou em assadeiras lambuzadas com espuma de barbear ou mingau espesso.`,
          therapeuticObjective: `Aceitação de texturas amorfas e estimulação de pré-alfabetização na coordenação motora fina.`,
          ageRange: `${req.body.profile?.age || 4} anos`,
          difficulty: 'Médio',
          estimatedTime: '20 min',
          materialsNeeded: ['Espuma de barbear ou condicionador de cabelo simples', 'Uma assadeira grande ou parede lisa lavável', 'Espátula ou apenas os dedinhos'],
          stepByStep: [
            'Espalhe uma camada fina de espuma sobre a bacia ou assadeira.',
            'Escreva com seu próprio dedo uma letra grande confortável (Ex: a inicial do nome).',
            'Instigue a criança a cobrir sob as mesmas trilhas desenhadas, limpando o caminho.',
            'Caso ela tenha aversão pura à viscosidade, use um palitinho de sorvete ou pincel como extensor no começo para incentivar o exercício.'
          ],
          expectedBenefits: [
            'Diminui dores e traumas de hipersensibilidade tátil úmida',
            'Fomenta o reconhecimento visuo-facial das letras geométricas',
            'Incentiva a independência criativa'
          ],
          extraTips: `Se a criança gostar de texturas na boca, substitua por iogurte natural com gotinhas de corante alimentício de sua preferência. É super seguro e calmante!`,
          category: 'Alfabetização',
          isFavorite: false,
          isCompleted: false
        }
      ]
    });
  }
});

// Profiles Endpoint
app.get('/api/profiles', async (req, res) => {
  const profiles = await getCollectionDocs('profiles');
  res.json({ profiles });
});

app.post('/api/profiles', async (req, res) => {
  const newProfile = {
    ...req.body,
    id: `profile-${Date.now()}`,
    age: Math.max(1, parseInt(req.body.age) || 4),
  };
  DATABASE.profiles.push(newProfile);
  await setCollectionDoc('profiles', newProfile.id, newProfile);
  res.status(201).json({ success: true, profile: newProfile });
});

app.put('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  const profiles = await getCollectionDocs('profiles');
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    const updated = { ...profiles[index], ...req.body };
    DATABASE.profiles[index] = updated;
    await setCollectionDoc('profiles', id, updated);
    res.json({ success: true, profile: updated });
  } else {
    const fallbackProfile = { ...req.body, id };
    await setCollectionDoc('profiles', id, fallbackProfile);
    res.json({ success: true, profile: fallbackProfile });
  }
});

// Visual Routine Endpoint
app.get('/api/routine', async (req, res) => {
  const routine = await getCollectionDocs('routine', DEFAULT_ROUTINE);
  res.json({ routine });
});

app.post('/api/routine', async (req, res) => {
  const newTask = {
    ...req.body,
    id: `routine-${Date.now()}`,
    isCompleted: false
  };
  DATABASE.routine.push(newTask);
  await setCollectionDoc('routine', newTask.id, newTask);
  res.status(201).json({ success: true, task: newTask });
});

app.patch('/api/routine/:id', async (req, res) => {
  const { id } = req.params;
  const routine = await getCollectionDocs('routine', DEFAULT_ROUTINE);
  const index = routine.findIndex(t => t.id === id);
  if (index !== -1) {
    const updated = { ...routine[index], ...req.body };
    DATABASE.routine[index] = updated;
    await setCollectionDoc('routine', id, updated);
    res.json({ success: true, task: updated });
  } else {
    res.status(404).json({ error: 'Tarefa de rotina não encontrada' });
  }
});

app.delete('/api/routine/:id', async (req, res) => {
  const { id } = req.params;
  DATABASE.routine = DATABASE.routine.filter(t => t.id !== id);
  await deleteCollectionDoc('routine', id);
  res.json({ success: true });
});

// Diary Endpoint
app.get('/api/diary', async (req, res) => {
  const diary = await getCollectionDocs('diary');
  // Order most recent first
  const sortedDiary = [...diary].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json({ diary: sortedDiary });
});

app.post('/api/diary', async (req, res) => {
  const newDiary = {
    ...req.body,
    id: `diary-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  DATABASE.diary.unshift(newDiary); // Mais recente primeiro
  await setCollectionDoc('diary', newDiary.id, newDiary);
  res.status(201).json({ success: true, diary: newDiary });
});

// Appointments Endpoint
app.get('/api/appointments', async (req, res) => {
  const appointments = await getCollectionDocs('appointments', DEFAULT_APPOINTMENTS);
  res.json({ appointments });
});

app.post('/api/appointments', async (req, res) => {
  const newAppointment = {
    ...req.body,
    id: `appointment-${Date.now()}`,
    isCompleted: false
  };
  DATABASE.appointments.push(newAppointment);
  await setCollectionDoc('appointments', newAppointment.id, newAppointment);
  res.status(201).json({ success: true, appointment: newAppointment });
});

app.patch('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const appointments = await getCollectionDocs('appointments', DEFAULT_APPOINTMENTS);
  const index = appointments.findIndex(ap => ap.id === id);
  if (index !== -1) {
    const updated = { ...appointments[index], ...req.body };
    DATABASE.appointments[index] = updated;
    await setCollectionDoc('appointments', id, updated);
    res.json({ success: true, appointment: updated });
  } else {
    res.status(404).json({ error: 'Compromisso não encontrado' });
  }
});

// Delete Appointment Endpoint
app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  DATABASE.appointments = DATABASE.appointments.filter(ap => ap.id !== id);
  await deleteCollectionDoc('appointments', id);
  res.json({ success: true });
});

// Custom activities added by administrator
app.get('/api/custom-activities', async (req, res) => {
  const customActivities = await getCollectionDocs('customActivities');
  res.json({ customActivities });
});

app.post('/api/custom-activities', async (req, res) => {
  const newAct = {
    ...req.body,
    id: `custom-activity-${Date.now()}`,
    isFavorite: false,
    isCompleted: false,
  };
  DATABASE.customActivities.push(newAct);
  await setCollectionDoc('customActivities', newAct.id, newAct);
  res.status(201).json({ success: true, activity: newAct });
});

// Serve Vite dev server or static build assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mundo Atípico Server] Rodando com sucesso na porta ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Falha crítica ao iniciar barramento do servidor:', err);
});
