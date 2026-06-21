/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import {
  ChildProfile,
  Activity,
  RoutineTask,
  DiaryEntry,
  Appointment,
  ActivityCategory
} from './types';
import {
  Heart,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Smile,
  Sparkles,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  User,
  Settings,
  ShieldAlert,
  Award,
  FileText,
  AlertTriangle,
  ArrowRight,
  Share2,
  Bell,
  Search,
  Check,
  Edit2,
  Play,
  Volume2,
  Accessibility,
  Database,
  RefreshCw,
  TrendingUp,
  X,
  Lock,
  Download,
  Activity as ActivityIcon
} from 'lucide-react';

// Main Application wrapper with the context provider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const {
    isAuthenticated,
    currentUser,
    preferences,
    profiles,
    activeProfile,
    activities,
    routine,
    diary,
    appointments,
    isLoading,
    isAiLoading,
    aiMessage,
    isOnline,
    setIsOnline,
    isDownloading,
    downloadProgress,
    downloadOfflineData,
    syncOfflineQueue,
    offlineQueueCount,
    login,
    logout,
    updatePreferences,
    setActiveChild,
    addProfile,
    updateProfile,
    toggleFavorite,
    toggleCompleted,
    addRoutineTask,
    toggleRoutineTask,
    deleteRoutineTask,
    addDiaryEntry,
    addAppointment,
    toggleAppointment,
    deleteAppointment,
    requestAiRecommendations,
    addCustomActivity,
    showPushNotification,
    activeNotification,
    clearNotification
  } = useApp();

  // Application Phases: 'splash' | 'onboarding' | 'auth' | 'main'
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'auth' | 'main'>('splash');
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  // Authentication Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authPassword, setAuthPassword] = useState('');

  // Active Screen within Main phase: 'dashboard' | 'activities' | 'routine' | 'diary' | 'appointments' | 'reports' | 'admin'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activities' | 'routine' | 'diary' | 'appointments' | 'reports' | 'admin'>('dashboard');

  // Interactive filters for Activities
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'Todas'>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Todas' | 'Fácil' | 'Médio' | 'Difícil'>('Todas');
  const [activeActivityModal, setActiveActivityModal] = useState<Activity | null>(null);

  // New Child Registration States
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildBirthDate, setNewChildBirthDate] = useState('2021-01-01');
  const [newChildInterests, setNewChildInterests] = useState('');
  const [newChildSkills, setNewChildSkills] = useState('');
  const [newChildChallenges, setNewChildChallenges] = useState('');
  const [newChildObjectives, setNewChildObjectives] = useState('');
  const [newChildSensory, setNewChildSensory] = useState('');
  const [newChildRemarks, setNewChildRemarks] = useState('');

  // New Routine Task Form States
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineTime, setRoutineTime] = useState('08:00');
  const [routinePictogram, setRoutinePictogram] = useState('💪');
  const [routineReminder, setRoutineReminder] = useState(true);

  // New Diary Entry States
  const [diaryBehaviors, setDiaryBehaviors] = useState<string[]>([]);
  const [diaryEmotion, setDiaryEmotion] = useState<'calm' | 'happy' | 'stimulated' | 'agitated' | 'meltdown'>('calm');
  const [diaryProgress, setDiaryProgress] = useState('');
  const [diaryChallenges, setDiaryChallenges] = useState('');
  const [diaryNotes, setDiaryNotes] = useState('');

  // New Appointment States
  const [apTitle, setApTitle] = useState('');
  const [apType, setApType] = useState<'consulta' | 'terapia' | 'escola' | 'medicamento' | 'compromisso'>('terapia');
  const [apDesc, setApDesc] = useState('');
  const [apDateTime, setApDateTime] = useState('2026-06-20T14:30');
  const [apProfessional, setApProfessional] = useState('');

  // Admin New Activity States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminDesc, setAdminDesc] = useState('');
  const [adminObjective, setAdminObjective] = useState('');
  const [adminAgeRange, setAdminAgeRange] = useState('3-6 anos');
  const [adminDifficulty, setAdminDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Fácil');
  const [adminTime, setAdminTime] = useState('20 min');
  const [adminMaterials, setAdminMaterials] = useState('');
  const [adminSteps, setAdminSteps] = useState('');
  const [adminBenefits, setAdminBenefits] = useState('');
  const [adminTips, setAdminTips] = useState('');
  const [adminCategory, setAdminCategory] = useState<ActivityCategory>('Estimulação sensorial');

  // Push Notification Creation
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Custom simulation PDF preview
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Accessibility size class calculations
  const textClass = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'base': return 'text-sm lg:text-base';
      case 'lg': return 'text-base lg:text-lg';
      case 'xl': return 'text-lg lg:text-xl';
      default: return 'text-sm lg:text-base';
    }
  };

  const titleClass = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    switch (size) {
      case 'sm': return 'text-base font-bold';
      case 'base': return 'text-lg lg:text-xl font-bold';
      case 'lg': return 'text-xl lg:text-2xl font-bold';
      case 'xl': return 'text-2xl lg:text-3xl font-black tracking-tight';
      default: return 'text-lg lg:text-xl font-bold';
    }
  };

  // Skip Splash Screen to Onboarding or Dashboard automatically
  useEffect(() => {
    if (appPhase === 'splash') {
      const timer = setTimeout(() => {
        const hasOnboarded = localStorage.getItem('mundo_atipico_onboarding');
        if (isAuthenticated) {
          setAppPhase('main');
        } else if (hasOnboarded) {
          setAppPhase('auth');
        } else {
          setAppPhase('onboarding');
        }
      }, 3500); // Elegant 3.5s splash animation representation
      return () => clearTimeout(timer);
    }
  }, [appPhase, isAuthenticated]);

  // Clean onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('mundo_atipico_onboarding', 'done');
    setAppPhase('auth');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      showPushNotification('Alerta', 'Insira seu email institucional ou pessoal para prosseguir.');
      return;
    }
    const name = authName || (authEmail.split('@')[0]);
    login(authEmail, name);
    setAppPhase('main');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authName) {
      showPushNotification('Alerta', 'Preencha todos os campos para efetuarmos seu acolhimento de rede.');
      return;
    }
    login(authEmail, authName);
    setAppPhase('main');
  };

  const handleAddNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName) return;

    addProfile({
      name: newChildName,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newChildName)}`,
      birthDate: newChildBirthDate,
      interests: newChildInterests.split(',').map(s => s.trim()).filter(Boolean),
      skills: newChildSkills.split(',').map(s => s.trim()).filter(Boolean),
      challenges: newChildChallenges.split(',').map(s => s.trim()).filter(Boolean),
      therapeuticObjectives: newChildObjectives.split(',').map(s => s.trim()).filter(Boolean),
      sensoryPreferences: newChildSensory.split(',').map(s => s.trim()).filter(Boolean),
      generalObservations: newChildRemarks
    });

    // Reset fields
    setNewChildName('');
    setNewChildInterests('');
    setNewChildSkills('');
    setNewChildChallenges('');
    setNewChildObjectives('');
    setNewChildSensory('');
    setNewChildRemarks('');
    setShowAddChildModal(false);
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle) return;

    addRoutineTask({
      childId: activeProfile?.id || 'main-child-id',
      title: routineTitle,
      time: routineTime,
      pictogramName: routinePictogram,
      reminderEnabled: routineReminder
    });

    setRoutineTitle('');
    setRoutineTime('08:00');
    setRoutinePictogram('💪');
  };

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    addDiaryEntry({
      childId: activeProfile.id,
      date: new Date().toISOString().split('T')[0],
      observedBehaviors: diaryBehaviors,
      emotionRating: diaryEmotion,
      progressMade: diaryProgress || 'Registrou atividade regulada com progresso contínuo.',
      challengesFaced: diaryChallenges || 'Nenhuma barreira sensorial grave identificada.',
      generalNotes: diaryNotes
    });

    // Clear state
    setDiaryBehaviors([]);
    setDiaryProgress('');
    setDiaryChallenges('');
    setDiaryNotes('');
    setDiaryEmotion('calm');
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apTitle) return;

    addAppointment({
      childId: activeProfile?.id || 'main-child-id',
      type: apType,
      title: apTitle,
      description: apDesc,
      dateTime: apDateTime,
      professionalName: apProfessional
    });

    setApTitle('');
    setApDesc('');
    setApProfessional('');
  };

  const handleAdminActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle || !adminDesc) {
      showPushNotification('Erro de cadastro', 'Digite ao menos o título e descrição detalhada da atividade.');
      return;
    }

    addCustomActivity({
      title: adminTitle,
      description: adminDesc,
      therapeuticObjective: adminObjective || 'Trabalhar desenvolvimento coordenado da criança',
      ageRange: adminAgeRange || 'Todas as idades',
      difficulty: adminDifficulty,
      estimatedTime: adminTime || '20 min',
      materialsNeeded: adminMaterials.split(',').map(m => m.trim()).filter(Boolean),
      stepByStep: adminSteps.split('\n').map(s => s.trim()).filter(Boolean),
      expectedBenefits: adminBenefits.split(',').map(b => b.trim()).filter(Boolean),
      extraTips: adminTips || 'Proceda de forma calma e gradual sem forçar se houver choro ou sobrecarga.',
      category: adminCategory
    });

    // Reset administrative fields
    setAdminTitle('');
    setAdminDesc('');
    setAdminObjective('');
    setAdminMaterials('');
    setAdminSteps('');
    setAdminBenefits('');
    setAdminTips('');
  };

  const handleSendCustomPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    showPushNotification(notifTitle, notifMessage);
    setNotifTitle('');
    setNotifMessage('');
  };

  // Activity categorizer counters
  const getCategoryCount = (catName: ActivityCategory | 'Todas') => {
    if (catName === 'Todas') return activities.length;
    return activities.filter(a => a.category === catName).length;
  };

  // Filter activities dynamically
  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.therapeuticObjective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || act.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Todas' || act.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Simple statistics generator for Reports
  const getCompletedCount = () => activities.filter(a => a.isCompleted).length;
  const getFavoriteCount = () => activities.filter(a => a.isFavorite).length;
  const getWeeklyCompletedCount = () => routine.filter(r => r.isCompleted).length;

  const CATEGORIES_LIST: ActivityCategory[] = [
    'Comunicação',
    'Linguagem',
    'Coordenação motora fina',
    'Coordenação motora ampla',
    'Regulação emocional',
    'Habilidades sociais',
    'Atenção e concentração',
    'Alfabetização',
    'Matemática',
    'Estimulação sensorial',
    'Autonomia',
    'Vida diária',
    'Brincadeiras educativas',
    'Percepção visual',
    'Funções executivas',
    'Jogos educativos'
  ];

  // ---------------- RENDERS ----------------

  // Phase 1: Splash Screen
  if (appPhase === 'splash') {
    return (
      <div id="splash-container" className="h-screen w-screen bg-[#F0FDF4] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200/55 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-100/55 rounded-full blur-3xl"></div>

        <div className="text-center z-10 p-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl border border-teal-50 mb-8 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-600">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M19 3v4" />
              <path d="M21 5h-4" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-teal-800 tracking-tight mt-2 mb-4">Mundo Atípico</h1>
          <div className="w-16 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-teal-700/90 italic font-medium text-base mb-2">
            "Pequenas conquistas constroem grandes jornadas."
          </p>
          <p className="text-xs text-slate-400 mt-8 uppercase tracking-widest font-bold">PEDIATRIA • APOIO • ACOLHIMENTO</p>
        </div>

        {/* Informative Disclaimer */}
        <div className="absolute bottom-6 mx-auto w-full max-w-md px-6 text-center">
          <p className="text-[11px] text-teal-800/80 bg-teal-50/70 p-3 rounded-2xl border border-teal-100">
            <strong>Aviso de saúde:</strong> Fornecemos recursos de apoio pedagógico e lúdico. O applet NÃO realiza diagnósticos e não substitui profissionais de saúde especializados.
          </p>
        </div>
      </div>
    );
  }

  // Phase 2: Onboarding screen
  if (appPhase === 'onboarding') {
    const slides = [
      {
        title: "Atividades Terapêuticas",
        text: "Tenha acesso a uma curadoria clínica com mais de 600 atividades práticas detalhadas, catalogadas de forma acessível para desenvolver múltiplas competências autistas nas esferas sensoriais, motoras e emocionais.",
        illustration: "🧩",
        bgColor: "from-teal-50 to-teal-100/60"
      },
      {
        title: "Rotina Visual Previsível",
        text: "Auxilie na estruturação de rotinas e diminua picos de ansiedade com uma interface altamente gráfica. Use pictogramas, defina horários fixos e estimule a autonomia infantil com facilidade de marcação e incentivo.",
        illustration: "📅",
        bgColor: "from-indigo-50 to-indigo-100/60"
      },
      {
        title: "Aprendizado pelo Brincar",
        text: "Aprender brincando reduz resistências lúdicas. Filtre atividades por idade, materiais e potencialidades, adaptando o cotidiano de acordo com a idade sensorial e física de cada criança.",
        illustration: "🎨",
        bgColor: "from-amber-50 to-amber-100/60"
      },
      {
        title: "Apoio Profissional no Bolso",
        text: "Nosso aplicativo fornece ferramentas úteis de monitoramento, suporte de Inteligência Artificial para gerar atividades e diário prático, mas relembramos que o app não substitui as consultas com Pediatras, Neurologistas, Terapeutas Ocupacionais e Fonoaudiólogos.",
        illustration: "🤝",
        bgColor: "from-rose-50 to-rose-100/60"
      }
    ];

    const currentSlide = slides[onboardingIndex];

    return (
      <div id="onboarding-container" className="h-screen w-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col justify-between h-[650px] transition-all">
          
          {/* Upper slide illustration & text container */}
          <div className={`p-8 lg:p-12 flex-1 flex flex-col justify-center items-center text-center bg-gradient-to-b ${currentSlide.bgColor}`}>
            <span className="text-7xl mb-6 select-none animate-bounce">{currentSlide.illustration}</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4">{currentSlide.title}</h2>
            <p className="text-slate-600 text-sm lg:text-base leading-relaxed max-w-md">{currentSlide.text}</p>
          </div>

          {/* Under buttons controls */}
          <div className="p-8 border-t border-slate-100 bg-white flex flex-col gap-4">
            {/* Pagination Bubble Bullets */}
            <div className="flex justify-center gap-2 mb-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOnboardingIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${idx === onboardingIndex ? 'w-8 bg-teal-500' : 'w-2.5 bg-slate-200'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleOnboardingComplete}
                className="text-slate-400 hover:text-slate-600 text-xs uppercase tracking-wider font-bold p-2"
              >
                Pular Onboarding
              </button>

              {onboardingIndex < slides.length - 1 ? (
                <button
                  onClick={() => setOnboardingIndex(p => p + 1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-teal-100 hover:shadow-teal-200"
                >
                  Continuar
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleOnboardingComplete}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
                >
                  Começar Jornada
                  <Check size={18} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Phase 3: Auth Screen (Accompany register/login)
  if (appPhase === 'auth') {
    return (
      <div id="auth-container" className="h-screen w-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col justify-between p-8 lg:p-10 relative">
          
          <div>
            {/* Title with decorative puzzle pieces */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mundo Atípico</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {isRegistering ? 'Criar sua conta de apoio' : 'Boas-vindas à nossa rede'}
              </h2>
              <p className="text-xs text-slate-500">
                Proporcionando acolhimento, pedagogia integrativa organizada e segurança de dados.
              </p>
            </div>

            {/* Simulated OAuth Social Login */}
            <button
              onClick={() => {
                login('bigodeevandro699@gmail.com', 'Evandro Bigode');
                setAppPhase('main');
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-3 mb-6 transition"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" fillRule="evenodd" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" fillRule="evenodd" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" fillRule="evenodd" />
              </svg>
              Entrar rapidamente com o Google
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-1 border-slate-100" />
              <span className="px-3 text-xs text-slate-400 font-bold uppercase shrink-0">Ou use e-mail</span>
              <hr className="flex-1 border-slate-100" />
            </div>

            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Seu Nome / Apelido</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Ex: Helen, Tio Marcelo, Clinica Crescer"
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Seu melhor e-mail institucional"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Senha secreta (Mínimo de 6 dígitos)</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transition"
                >
                  {isRegistering ? 'Cadastrar e Conectar' : 'Entrar na Plataforma'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-3 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              {isRegistering ? 'Já tem conta? Faça Login' : 'Novo no app? Cadastre-se por e-mail'}
            </button>
            <p className="text-[10px] text-amber-700 leading-relaxed font-semibold uppercase bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              ⚠️ Este aplicativo auxilia no acompanhamento pedagógico de TEA, mas não substitui diagnósticos clínicos profissionais.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Enforce child profile registration if none exist (start fresh on first login!)
  if (appPhase === 'main' && profiles.length === 0) {
    return (
      <div id="first-child-onboarding" className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-10 font-sans">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden p-8 lg:p-10 flex flex-col gap-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Primeiro Acesso: Cadastro da Criança</h2>
              <p className="text-xs text-slate-500">Para iniciar seu acolhimento pedagógico e estruturar rotinas lúdicas, cadastre o perfil da sua criança abaixo:</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newChildName) return;
            addProfile({
              name: newChildName,
              photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newChildName)}`,
              birthDate: newChildBirthDate,
              interests: newChildInterests.split(',').map(s => s.trim()).filter(Boolean),
              skills: newChildSkills.split(',').map(s => s.trim()).filter(Boolean),
              challenges: newChildChallenges.split(',').map(s => s.trim()).filter(Boolean),
              therapeuticObjectives: newChildObjectives.split(',').map(s => s.trim()).filter(Boolean),
              sensoryPreferences: newChildSensory.split(',').map(s => s.trim()).filter(Boolean),
              generalObservations: newChildRemarks
            });
            // Reset inputs
            setNewChildName('');
            setNewChildBirthDate('2021-01-01');
            setNewChildInterests('');
            setNewChildSkills('');
            setNewChildChallenges('');
            setNewChildObjectives('');
            setNewChildSensory('');
            setNewChildRemarks('');
          }} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome / Apelido do Pequeno</label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="Ex: Arthur (Tuti), Maria, Helena"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={newChildBirthDate}
                  onChange={(e) => setNewChildBirthDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interesses / Hiperfocos (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildInterests}
                  onChange={(e) => setNewChildInterests(e.target.value)}
                  placeholder="Ex: Legos, Som de piano, Água, Dinossauros"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Habilidades / Pontos Fortes (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildSkills}
                  onChange={(e) => setNewChildSkills(e.target.value)}
                  placeholder="Ex: Alfabeto completo, Excelente memória"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dificuldades / Limitações (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildChallenges}
                  onChange={(e) => setNewChildChallenges(e.target.value)}
                  placeholder="Ex: Som agudo, Seletividade alimentar"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Objetivos Clínicos/Pedagógicos (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildObjectives}
                  onChange={(e) => setNewChildObjectives(e.target.value)}
                  placeholder="Ex: Posição de pinça, Tolerar meias"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preferências Sensoriais (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildSensory}
                  onChange={(e) => setNewChildSensory(e.target.value)}
                  placeholder="Ex: Pressão firme, Estímulos de luz suave"
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Anotações ou Observações Livres</label>
                <input
                  type="text"
                  value={newChildRemarks}
                  onChange={(e) => setNewChildRemarks(e.target.value)}
                  placeholder="Ex: Reage favoravelmente a cartões visuais."
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transition mt-6 text-xs uppercase tracking-wider cursor-pointer"
            >
              Confirmar Acolhimento e Entrar
              <CheckCircle2 size={16} />
            </button>
          </form>
          
          <div className="border-t border-slate-100 pt-4 text-center">
            <button
              onClick={() => {
                logout();
                setAppPhase('auth');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
            >
              Cancelar e Sair da Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 4: Main Application dashboard
  return (
    <div className={`min-h-screen ${preferences.themeMode === 'dark' ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'} ${preferences.highContrast ? 'contrast-125' : ''}`}>
      {/* Dynamic Push Notification Simulator at the Top! */}
      {activeNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#0F172A] text-white p-5 rounded-2xl shadow-2xl border border-teal-500 max-w-sm flex items-start gap-4 animate-bounce">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
            <Bell size={20} className="text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <h5 className="font-black text-sm text-teal-400">{activeNotification.title}</h5>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">{activeNotification.message}</p>
          </div>
          <button onClick={clearNotification} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* AI Recommendation loading overlay */}
      {isAiLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl p-4 shadow-2xl border border-teal-50 mb-6 flex items-center justify-center">
            <Sparkles size={40} className="text-teal-500 animate-spin" />
          </div>
          <h3 className="text-white text-xl lg:text-2xl font-black mb-2 animate-pulse">Inteligência Clínica Ativa</h3>
          <p className="text-teal-200 text-sm max-w-md mb-6">{aiMessage}</p>
          <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 w-2/3 animate-ping"></div>
          </div>
        </div>
      )}

      {/* Dynamic Grid Layout to match sleek UI design with double Sidebars */}
      <div className="flex min-h-screen">
        
        {/* Left Sidebar Menu */}
        <aside className={`w-72 shrink-0 border-r ${preferences.themeMode === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} hidden lg:flex flex-col`}>
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-teal-700">Mundo Atípico</h1>
                <p className="text-[10px] text-indigo-500 uppercase tracking-wider font-bold">Terapias &amp; Progresso</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1.5">
              {[
                { id: 'dashboard', label: 'Início', icon: Sparkles },
                { id: 'activities', label: 'Curadoria Atividades', icon: BookOpen },
                { id: 'routine', label: 'Rotina Visual', icon: Clock },
                { id: 'diary', label: 'Diário Evolutivo', icon: Smile },
                { id: 'appointments', label: 'Calendário Terapêutico', icon: CalendarIcon },
                { id: 'reports', label: 'Relatórios', icon: FileText },
                { id: 'admin', label: 'Painel Clínico/Admin', icon: Settings }
              ].map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id as any)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-100'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Prompt warning & Child profile info */}
          <div className="mt-auto p-4 border-t border-slate-100">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-amber-800 leading-snug font-bold uppercase tracking-wider">Aviso Clínico Importante</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed mt-1">
                    Este software fornece ferramentas pedagógicas de apoio ao brincar autista. Ele não emite diagnósticos. Sempre consulte médicos especializados.
                  </p>
                </div>
              </div>
            </div>

            {/* Logout panel */}
            <div className="mt-4 flex items-center justify-between p-2">
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => setAppPhase('auth')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic central Main viewport */}
        <main className={`flex-1 p-6 lg:p-10 ${preferences.themeMode === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
          
          {/* Mobile responsive Header drawer link & Child selector banner */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 lg:hidden mb-4">
                <span className="p-2 bg-teal-500 text-white rounded-xl">🧩</span>
                <h1 className="text-xl font-bold text-teal-800">Mundo Atípico</h1>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Olá, {currentUser?.name || 'Profissional'} 👋
              </h2>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                "Pequenas conquistas constroem grandes jornadas."
              </p>
            </div>

            {/* Child Profile switcher and creation trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Network Connections Simulator / Offline Pill */}
              <div className="flex items-center gap-2 bg-white p-2 px-3.5 rounded-full border border-slate-200 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className="flex items-center gap-2 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <span className={`w-3 h-3 rounded-full transition-all duration-300 ${isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse' : 'bg-rose-500 shadow-lg shadow-rose-200'}`} />
                  <span className={isOnline ? 'text-emerald-700' : 'text-rose-700'}>
                    {isOnline ? 'Rede Conectada' : 'Modo Offline Ativo'}
                  </span>
                </button>
                {offlineQueueCount > 0 && (
                  <span className="text-[9px] font-black bg-rose-600 text-white rounded-full px-2 py-0.5 ml-1 animate-bounce shrink-0 shadow-sm shadow-rose-150">
                    {offlineQueueCount} pendente{offlineQueueCount > 1 ? 's' : ''}
                  </span>
                )}
                {isOnline && (
                  <button
                    onClick={downloadOfflineData}
                    disabled={isDownloading}
                    className="border-l border-slate-200 pl-2 text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                    title="Baixar Atividades e Rotinas para acesso offline"
                  >
                    <Download size={13} className={isDownloading ? 'animate-bounce' : ''} />
                    {isDownloading ? `${downloadProgress}%` : 'Baixar'}
                  </button>
                )}
              </div>

              {profiles.length > 0 ? (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-full border border-slate-200 shadow-sm shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-indigo-200 shadow-inner">
                    <img src={activeProfile?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="Child profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <select
                      className="text-xs font-bold text-slate-800 focus:outline-none cursor-pointer bg-transparent"
                      value={activeProfile?.id}
                      onChange={(e) => setActiveChild(e.target.value)}
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.age} anos)</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-0.5">Clique para alternar perfil</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddChildModal(true)}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-teal-200 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Cadastrar Primeira Criança
                </button>
              )}

              <button
                onClick={() => setShowAddChildModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-150"
              >
                <Plus size={16} />
                Nova Criança
              </button>
            </div>
          </header>

          {/* Quick tabs bar specifically for small mobile screens (underlg flag) to jump inside without leftbar */}
          <div className="lg:hidden flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-none">
            {[
              { id: 'dashboard', label: 'Início', emoji: '✨' },
              { id: 'activities', label: 'Curadoria Atividades', emoji: '🧩' },
              { id: 'routine', label: 'Rotina', emoji: '🕰️' },
              { id: 'diary', label: 'Diário', emoji: '📝' },
              { id: 'appointments', label: 'Calendário', emoji: '📅' },
              { id: 'reports', label: 'Relatórios', emoji: '📊' },
              { id: 'admin', label: 'Admin', emoji: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
                  activeTab === tab.id ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Disclaimer warning banner prominent top view */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
            <div className="relative z-10 max-w-xl">
              <span className="bg-indigo-400/30 text-indigo-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Novidade no Autismo
              </span>
              <h3 className="text-2xl font-black mt-3 mb-2">Previsibilidade &amp; Sucesso</h3>
              <p className="text-indigo-100/90 text-xs leading-relaxed">
                Explore nosso motor de recomendação inteligente. Nós mapeamos as preferências sensoriais de {activeProfile?.name || 'sua criança'} para sugerir itinerários terapêuticos divertidos na escola, clínica e lar sem custos altos.
              </p>
              <button
                onClick={requestAiRecommendations}
                className="mt-4 bg-white text-indigo-700 hover:bg-slate-100 transition-all text-xs font-black px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Sparkles size={16} className="text-indigo-600" />
                Gerar Atividades Personalizadas por IA
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* TAB 1: DASHBOARD PRINCIPAL */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="space-y-8 animate-fade-in font-sans">
              {/* Gamification Hub: Nível, XP e Medalhas de Conquistas */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 lg:p-8 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Level and Progress bar */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🎮</span>
                      <div>
                        <h4 className="text-xl font-black tracking-tight text-white mb-0.5">Gamificação do Brincar</h4>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Acompanhamento e Motivação</p>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-[11px] text-indigo-200">Progresso de {activeProfile?.name || 'Criança'}</p>
                          <p className="text-lg font-black text-teal-400">Nível {Math.floor((activeProfile?.points || 0) / 50) + 1}</p>
                        </div>
                        <span className="text-2xl" title="Título honorário pelo acompanhamento">
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 === 1 && '🌱'}
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 === 2 && '🔍'}
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 === 3 && '✨'}
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 === 4 && '🧸'}
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 === 5 && '🌈'}
                          {Math.floor((activeProfile?.points || 0) / 50) + 1 >= 6 && '🏆'}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-300 mt-1">
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 === 1 && 'Acolhedor Iniciante'}
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 === 2 && 'Explorador Atento'}
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 === 3 && 'Guia Brilhante'}
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 === 4 && 'Mentor do Brincar'}
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 === 5 && 'Mestre Sensorial'}
                        {Math.floor((activeProfile?.points || 0) / 50) + 1 >= 6 && 'Guardião da Evolução'}
                      </p>

                      {/* XP Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[11px] text-slate-300 mb-1.5 font-semibold">
                          <span>{(activeProfile?.points || 0) % 50} XP</span>
                          <span>50 XP para o Nível {Math.floor((activeProfile?.points || 0) / 50) + 2}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                          <div
                            className="bg-gradient-to-r from-teal-400 to-indigo-400 h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                            style={{ width: `${((activeProfile?.points || 0) % 50 / 50) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-indigo-200 mt-3 bg-slate-900/30 p-2 rounded-xl border border-white/5 font-bold">
                        <span>Total Acumulado:</span>
                        <span className="font-bold text-teal-300">{activeProfile?.points || 0} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Achievements board with medals */}
                  <div className="lg:col-span-8">
                    <h5 className="text-xs font-black uppercase text-indigo-200 tracking-wider mb-4 flex items-center gap-1.5">
                      🎖️ Medalhas de Acompanhamento Terapêutico
                    </h5>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'first-step',
                          name: 'Primeiro Passo',
                          desc: 'Cadastro inicial concluído',
                          req: 'Cadastrar perfil',
                          badge: '🥇',
                          unlocked: activeProfile?.achievements?.includes('first-step') || true
                        },
                        {
                          id: 'explorer',
                          name: 'Explorador Lúdico',
                          desc: 'Concluiu 5 atividades',
                          req: '5 atividades',
                          badge: '🥈',
                          unlocked: activeProfile?.achievements?.includes('explorer') || (activities.filter(a => a.isCompleted).length >= 5)
                        },
                        {
                          id: 'champion',
                          name: 'Grande Campeão',
                          desc: 'Concluiu 10 atividades',
                          req: '10 atividades',
                          badge: '🏆',
                          unlocked: activeProfile?.achievements?.includes('champion') || (activities.filter(a => a.isCompleted).length >= 10)
                        },
                        {
                          id: 'routine-master',
                          name: 'Mestre do Ritmo',
                          desc: 'Concluiu 5 tarefas de rotina',
                          req: '5 tarefas',
                          badge: '📅',
                          unlocked: activeProfile?.achievements?.includes('routine-master') || (routine.filter(r => r.isCompleted).length >= 5)
                        },
                        {
                          id: 'diary-attentive',
                          name: 'Coração Atento',
                          desc: 'Efetuou 3 diários sensoriais',
                          req: '3 diários',
                          badge: '📝',
                          unlocked: activeProfile?.achievements?.includes('diary-attentive') || (diary.length >= 3)
                        },
                        {
                          id: 'diary-golden',
                          name: 'Consistência de Ouro',
                          desc: 'Escreveu 7 relatos diários',
                          req: '7 diários',
                          badge: '🔥',
                          unlocked: activeProfile?.achievements?.includes('diary-golden') || (diary.length >= 7)
                        }
                      ].map((med) => (
                        <div
                          key={med.id}
                          className={`p-3 rounded-2xl border transition-all text-left relative overflow-hidden select-none ${
                            med.unlocked
                              ? 'bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border-yellow-500/30 ring-1 ring-yellow-500/20'
                              : 'bg-[#1e293b]/20 border-white/5 opacity-40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-3xl bg-white/5 w-11 h-11 rounded-xl flex items-center justify-center border border-white/5 shadow-inner leading-none shrink-0">
                              {med.badge}
                            </span>
                            {med.unlocked ? (
                              <span className="text-[9px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full select-none uppercase tracking-wide">
                                Ativo ✓
                              </span>
                            ) : (
                              <span className="text-[9px] font-black bg-slate-800 text-slate-400 border border-white/5 px-2 py-0.5 rounded-full select-none uppercase tracking-wide">
                                Bloq 🔒
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs font-black text-slate-100 mt-2.5 tracking-tight truncate">{med.name}</p>
                          <p className="text-[10px] text-indigo-100/70 leading-normal mt-1 min-h-[30px] line-clamp-2">
                            {med.desc}
                          </p>
                          <p className="text-[9px] text-teal-400 mt-2 font-bold bg-teal-950/40 px-2 py-1 rounded-md inline-block">
                            {med.unlocked ? 'Desbloqueado' : `Requisito: ${med.req}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Highlight Recommendations & Metrics graph section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Recomended daily Activity Card */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Recomendada Hoje
                      </span>
                      <span className="text-xs text-slate-400">Objetivo de {activeProfile?.name || 'Arthur'}</span>
                    </div>

                    {activities.length > 0 ? (
                      <div>
                        <h4 className="text-xl font-bold text-slate-800">{activities[0].title}</h4>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3">
                          {activities[0].description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
                            ⏱️ {activities[0].estimatedTime}
                          </span>
                          <span className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
                            👶 {activities[0].ageRange}
                          </span>
                          <span className="bg-teal-50 text-teal-800 text-xs px-2.5 py-1 rounded-lg font-bold">
                            📂 {activities[0].category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Nenhuma atividade pré-cadastrada no momento.</p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => {
                        if (activities.length > 0) {
                          setActiveActivityModal(activities[0]);
                        }
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-50"
                    >
                      Começar Atividade
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-slate-500 hover:text-teal-700 font-bold text-xs"
                    >
                      Explorar outras 600+
                    </button>
                  </div>
                </div>

                {/* Progress stats card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Presença Semanal</h4>
                    <span className="text-[11px] bg-green-50 text-green-700 font-bold rounded-lg px-2 py-0.5">Normal</span>
                  </div>

                  {/* Graphical bar heights representation */}
                  <div className="flex items-end gap-3 h-32 pt-4">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-500 rounded-lg" style={{ height: '70px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Seg</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-300 rounded-lg" style={{ height: '40px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Ter</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-600 rounded-lg" style={{ height: '90px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Qua</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-slate-100 rounded-lg" style={{ height: '30px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Qui</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-400 rounded-lg" style={{ height: '65px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Sex</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-slate-100 rounded-lg" style={{ height: '10px' }}></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">Sáb</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Atividades Concluídas</p>
                      <p className="text-xl font-black text-slate-900 mt-0.5">{getCompletedCount()} brinquedos</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                      🏆
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom section: Short upcoming routine & Pediatric regulation Advice */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Routine tasks upcoming column */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800">Próximas Tarefas Visuais</h4>
                      <p className="text-[11px] text-slate-400">Modelar rotina e reforçar comportamentos</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('routine')}
                      className="text-xs text-teal-600 hover:text-teal-800 font-bold"
                    >
                      Ver Todas ({routine.length})
                    </button>
                  </div>

                  {routine.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutineTask(item.id)}
                      className={`flex items-center justify-between p-3.5 mb-3 rounded-2xl border cursor-pointer transitioning hover:scale-[1.01] ${
                        item.isCompleted
                          ? 'bg-emerald-50 border-emerald-100 opacity-70'
                          : 'bg-slate-50 border-slate-150'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl p-1.5 bg-white rounded-xl shadow-sm">{item.pictogramName}</span>
                        <div>
                          <p className={`text-xs font-bold ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold bg-white border px-2 py-0.5 rounded-md mt-1 inline-block">
                            🕰️ {item.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.isCompleted ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                            ✓ Concluído
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 hover:text-slate-700 bg-white border px-3 py-1 rounded-full uppercase">
                            Marcar concluído
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {routine.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400">Nenhuma tarefa cadastrada. Clique em "Rotina Visual" para personalizar.</p>
                    </div>
                  )}
                </div>

                {/* Regulation Tips block with therapeutic color (pale rose/amber) */}
                <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-100 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-amber-950 flex items-center gap-2 mb-3">
                      💡 Insight Terapêutico
                    </h5>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Linguagem e transição são críticas em crianças com TEA. Ao finalizar uma refeição ou brinquedo, faça contagem regressiva visual de 5 tempos e use o conceito: "Primeiro comemos, Depois jogamos dado de conversa!". Isso reduz crises em 80%.
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-amber-100">
                    <button
                      onClick={() => setActiveTab('diary')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                    >
                      Registrar Diário de Evolução
                    </button>
                  </div>
                </div>

              </div>

              {/* Profiles details list showing dynamic capabilities */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4">Habilidades &amp; Objetivos: {activeProfile?.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-slate-800">
                    <p className="text-xs font-black text-emerald-950 uppercase mb-2">⭐ Potencialidades / Interesses</p>
                    <ul className="space-y-1.5 list-disc pl-4 text-xs text-emerald-900 leading-relaxed">
                      {activeProfile?.interests.map((it, idx) => <li key={idx}>{it}</li>) || <li>Nenhum interesse</li>}
                    </ul>
                  </div>

                  <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 text-slate-800">
                    <p className="text-xs font-black text-blue-950 uppercase mb-2">🏔️ Desafios a Trabalhar</p>
                    <ul className="space-y-1.5 list-disc pl-4 text-xs text-blue-900 leading-relaxed">
                      {activeProfile?.challenges.map((ch, idx) => <li key={idx}>{ch}</li>) || <li>Nenhum desafio</li>}
                    </ul>
                  </div>

                  <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-150 text-slate-800">
                    <p className="text-xs font-black text-indigo-950 uppercase mb-2">🎯 Metas Terapêuticas</p>
                    <ul className="space-y-1.5 list-disc pl-4 text-xs text-indigo-900 leading-relaxed">
                      {activeProfile?.therapeuticObjectives.map((ob, idx) => <li key={idx}>{ob}</li>) || <li>Defina objetivos no perfil</li>}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATIVIDADES BIBLIOTECA - COMPLETO */}
          {activeTab === 'activities' && (
            <div id="tab-activities" className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Biblioteca Clínica</h3>
                  <p className="text-xs text-slate-500">Desenvolva autonomia, foco e coordenação motora com uma curadoria robusta de atividades adaptadas.</p>
                </div>
                <button
                  onClick={requestAiRecommendations}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 shrink-0"
                >
                  <Sparkles size={16} />
                  Perguntar ao Gemini (Recomendação TEA)
                </button>
              </div>

              {/* Search and Filters panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Search query field */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar por materiais, objetivos, etc..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2.5 text-xs transition"
                    />
                  </div>

                  {/* Difficulty selector */}
                  <div>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs transition"
                    >
                      <option value="Todas">Todas as dificuldades</option>
                      <option value="Fácil">Nível Fácil</option>
                      <option value="Médio">Nível Médio</option>
                      <option value="Difícil">Nível Difícil</option>
                    </select>
                  </div>

                  {/* Quick toggle info */}
                  <div className="flex items-center justify-end text-right">
                    <span className="text-xs font-bold text-slate-500 bg-teal-50 text-teal-800 px-3.5 py-1.5 rounded-xl border border-teal-100 shrink-0">
                      🎯 Exibindo {filteredActivities.length} de {activities.length} ações
                    </span>
                  </div>

                </div>

                {/* Horizontal list of 16 categories with quick counting chips */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Filtrar por Categoria Terapêutica</p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
                    <button
                      onClick={() => setSelectedCategory('Todas')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black shrink-0 transition-all ${
                        selectedCategory === 'Todas'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-105 select-none'
                      }`}
                    >
                      Todas ({getCategoryCount('Todas')})
                    </button>
                    {CATEGORIES_LIST.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black shrink-0 transition-all ${
                          selectedCategory === cat
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 select-none'
                        }`}
                      >
                        {cat} ({getCategoryCount(cat)})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid block of filtered activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300"
                  >
                    
                    <div className="p-5 space-y-4">
                      {/* Top badges and heart favorite button */}
                      <div className="flex justify-between items-start gap-4">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider truncate max-w-[200px]">
                          📂 {act.category}
                        </span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleFavorite(act.id)}
                            className={`p-2 rounded-xl border ${
                              act.isFavorite
                                ? 'bg-rose-50 border-rose-200 text-rose-500'
                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500'
                            }`}
                          >
                            <Heart size={14} fill={act.isFavorite ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>

                      {/* Header with beautiful fonts */}
                      <div>
                        <h4 className="text-base font-bold text-slate-800">{act.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed">{act.description}</p>
                      </div>

                      {/* Therapeutic objective details */}
                      <div className="bg-slate-50 p-3 rounded-2xl text-[11px] leading-relaxed text-slate-600 border border-slate-100">
                        <strong>Foco Clínico:</strong> {act.therapeuticObjective}
                      </div>

                      {/* Physical constraints */}
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">⏱️ {act.estimatedTime}</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">👶 {act.ageRange}</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          act.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                          act.difficulty === 'Médio' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>Nível: {act.difficulty}</span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
                      <button
                        onClick={() => setActiveActivityModal(act)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Passo a Passo
                      </button>

                      <button
                        onClick={() => toggleCompleted(act.id)}
                        className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-lg border transition-all ${
                          act.isCompleted
                            ? 'bg-emerald-500 text-white border-transparent'
                            : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200'
                        }`}
                      >
                        {act.isCompleted ? '✓ Concluido!' : 'Registrar Execução'}
                      </button>
                    </div>

                  </div>
                ))}

                {filteredActivities.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-400">Nenhuma atividade corresponde aos critérios estipulados.</p>
                    <button
                      onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); setSelectedDifficulty('Todas'); }}
                      className="mt-3 text-xs font-bold text-indigo-600"
                    >
                      Limpar Filtros e Exibir Todas
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ROTINA VISUAL */}
          {activeTab === 'routine' && (
            <div id="tab-routine" className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Rotina de Tarefas Visuais</h3>
                  <p className="text-xs text-slate-500">Desenvolva a estabilidade emocional de {activeProfile?.name || 'sua criança'} com metas claras de dia-a-dia.</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-xl border border-indigo-120 font-bold">
                  🧩 Apoio de Comunicação Alternativa (PEC/Pictogramas)
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Form to insert new task */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
                  <h4 className="text-base font-bold text-slate-800 mb-4">Adicionar Tarefa na Trilha</h4>
                  
                  <form onSubmit={handleAddRoutine} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome da Atividade / Tarefa</label>
                      <input
                        type="text"
                        required
                        value={routineTitle}
                        onChange={(e) => setRoutineTitle(e.target.value)}
                        placeholder="Ex: Escovar dentes, Tomar suco, Soneca"
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-[#50C878] rounded-xl px-4 py-2.5 text-xs transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Horário Alvo</label>
                        <input
                          type="time"
                          required
                          value={routineTime}
                          onChange={(e) => setRoutineTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pictograma Emoji</label>
                        <select
                          value={routinePictogram}
                          onChange={(e) => setRoutinePictogram(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition focus:outline-none"
                        >
                          <option value="🦷">🦷 Escovação</option>
                          <option value="🍞">🍞 Café da manhã</option>
                          <option value="🎨">🎨 Atividade sensorial</option>
                          <option value="🍛">🍛 Almoço</option>
                          <option value="🛌">🛌 Sono / Descanso</option>
                          <option value="🛁">🛁 Banho</option>
                          <option value="🎒">🎒 Escola / Aula</option>
                          <option value="🧸">🧸 Brinquedo livre</option>
                          <option value="🥦">🥦 Lanche da tarde</option>
                          <option value="💊">💊 Medicamento</option>
                          <option value="👟">👟 Calçar calçado</option>
                          <option value="📚">📚 Leitura visual</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="reminderCheck"
                        checked={routineReminder}
                        onChange={(e) => setRoutineReminder(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="reminderCheck" className="text-xs text-slate-600 font-medium">Habilitar notificação de lembrete por voz</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus size={16} />
                      Incluir na Linha Diária
                    </button>
                  </form>
                </div>

                {/* Listing of visual routine tasks */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-base font-bold text-slate-800 mb-4">Trilha Visual Ativa: {activeProfile?.name}</h4>
                  
                  <div className="space-y-3.5">
                    {routine.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                          item.isCompleted
                            ? 'bg-emerald-50 border-emerald-100 opacity-60'
                            : 'bg-[#F8FAFC] border-slate-150 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border">{item.pictogramName}</span>
                          <div>
                            <p className={`text-sm font-black ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black bg-teal-50 text-teal-700 border px-2 py-0.5 rounded-md">
                                🕰️ {item.time}
                              </span>
                              {item.reminderEnabled && (
                                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-medium px-2 py-0.5 rounded-md">
                                  🔔 Alerta de som
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleRoutineTask(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              item.isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600'
                            }`}
                          >
                            {item.isCompleted ? '✓ Concluido' : 'Marcar concluido'}
                          </button>
                          
                          <button
                            onClick={() => deleteRoutineTask(item.id)}
                            className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                      </div>
                    ))}

                    {routine.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-slate-400">Insira tarefas sensoriais ou de autonomia diária para preencher esta linha de atividades visuais.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: DIÁRIO DE EVOLUÇÃO */}
          {activeTab === 'diary' && (
            <div id="tab-diary" className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Diário Evolutivo</h3>
                  <p className="text-xs text-slate-500">Registre avanços comportamentais e monitore pontos de crise ou hipersensibilidade.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Journal Record form */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
                  <h4 className="text-base font-bold text-slate-800 mb-4">Adicionar Registro de Evolução</h4>
                  
                  <form onSubmit={handleAddDiary} className="space-y-4">
                    {/* Observed behaviors check lists */}
                    <div>
                      <p className="block text-xs font-bold text-slate-500 uppercase mb-2">Comportamentos Observados</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          'Foco Sustentado', 'Dificuldade de Foco', 'Agitação Motora',
                          'Sensibilidade a Som', 'Expressão Vocal', 'Recusa Alimentar',
                          'Brincar Funcional', 'Excelente Contato Visual'
                        ].map(bh => {
                          const isChecked = diaryBehaviors.includes(bh);
                          return (
                            <button
                              key={bh}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setDiaryBehaviors(p => p.filter(x => x !== bh));
                                } else {
                                  setDiaryBehaviors(p => [...p, bh]);
                                }
                              }}
                              className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all ${
                                isChecked
                                  ? 'bg-[#E0F2FE] border-indigo-400 text-indigo-950'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              {bh}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Emotion / regulation selectors */}
                    <div>
                      <p className="block text-xs font-bold text-slate-500 uppercase mb-2">Estado de Regulação Corporal</p>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-black">
                        {[
                          { id: 'calm', label: 'Calmo', emoji: '🟢' },
                          { id: 'happy', label: 'Alegre', emoji: '😄' },
                          { id: 'stimulated', label: 'Sensível', emoji: '🟡' },
                          { id: 'agitated', label: 'Agitado', emoji: '🟠' },
                          { id: 'meltdown', label: 'Crise', emoji: '🔴' }
                        ].map(em => (
                          <button
                            key={em.id}
                            type="button"
                            onClick={() => setDiaryEmotion(em.id as any)}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                              diaryEmotion === em.id
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            <span className="text-lg">{em.emoji}</span>
                            <span>{em.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Conquistas e Avanços Concretos</label>
                      <input
                        type="text"
                        value={diaryProgress}
                        onChange={(e) => setDiaryProgress(e.target.value)}
                        placeholder="Ex: Tolerou a brincadeira com arroz por 10 minutos."
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-[#50C878] rounded-xl px-4 py-2.5 text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Barreiras ou Desafios Identificados</label>
                      <input
                        type="text"
                        value={diaryChallenges}
                        onChange={(e) => setDiaryChallenges(e.target.value)}
                        placeholder="Ex: Se assustou com o som de liquidificador."
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-[#50C878] rounded-xl px-4 py-2.5 text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Observações Adicionais</label>
                      <textarea
                        value={diaryNotes}
                        onChange={(e) => setDiaryNotes(e.target.value)}
                        placeholder="Escreva livremente aqui..."
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-[#50C878] rounded-xl px-4 py-2 text-xs transition h-20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus size={16} />
                      Salvar Relato Diário
                    </button>
                  </form>
                </div>

                {/* History list */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-base font-bold text-slate-800 mb-2">Relatórios e Diários Cadastrados</h4>
                  
                  {diary.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-200 bg-slate-50 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl">
                          📅 Data: {item.date}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Urgência:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.emotionRating === 'happy' || item.emotionRating === 'calm' ? 'bg-green-100 text-green-800' :
                            item.emotionRating === 'stimulated' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800 animate-pulse'
                          }`}>
                            {item.emotionRating === 'calm' ? '🟢 Calmo' :
                             item.emotionRating === 'happy' ? '😄 Alegre' :
                             item.emotionRating === 'stimulated' ? '🟡 Sensível' :
                             item.emotionRating === 'agitated' ? '🟠 Agitado' : '🔴 Crise/Meltdown'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.observedBehaviors.map((b, i) => (
                          <span key={i} className="text-[10px] font-bold bg-white text-slate-500 border rounded-lg px-2 py-0.5">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                        <div>
                          <p className="font-bold text-green-800">✓ Avanços e Vitórias</p>
                          <p className="text-slate-600 mt-1">{item.progressMade}</p>
                        </div>
                        <div>
                          <p className="font-bold text-amber-800">🏔️ Barreiras</p>
                          <p className="text-slate-600 mt-1">{item.challengesFaced || 'Nenhum comportamento grave de recusa.'}</p>
                        </div>
                      </div>

                      {item.generalNotes && (
                        <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-500 italic mt-2.5 leading-relaxed">
                          "{item.generalNotes}"
                        </div>
                      )}
                    </div>
                  ))}

                  {diary.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-slate-400">Nenhum registro comportamental inserido ainda.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: CALENDÁRIO TERAPÊUTICO */}
          {activeTab === 'appointments' && (
            <div id="tab-appointments" className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Agenda Terapêutica</h3>
                  <p className="text-xs text-slate-500">Mantenha as consultas pedagógicas, médicas e sessões de terapia fonoaudiológica/ocupacional organizadas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Form to insert new appointment */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
                  <h4 className="text-base font-bold text-slate-800 mb-4">Agendar Evento de Rede</h4>
                  
                  <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título do Evento</label>
                      <input
                        type="text"
                        required
                        value={apTitle}
                        onChange={(e) => setApTitle(e.target.value)}
                        placeholder="Ex: Terapia Ocupacional, Pediatra"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo de Evento</label>
                        <select
                          value={apType}
                          onChange={(e) => setApType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition"
                        >
                          <option value="terapia">👨‍👩‍👧‍👦 Terapia</option>
                          <option value="consulta">🏥 Consulta Médica</option>
                          <option value="escola">🎒 Escola / Aula</option>
                          <option value="medicamento">💊 Suplemento / Remédio</option>
                          <option value="compromisso">🤝 Geral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Profissional Responsável</label>
                        <input
                          type="text"
                          value={apProfessional}
                          onChange={(e) => setApProfessional(e.target.value)}
                          placeholder="Ex: Dra. Sandra"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Data e Horário</label>
                      <input
                        type="datetime-local"
                        required
                        value={apDateTime}
                        onChange={(e) => setApDateTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Observações ou Preparativos</label>
                      <textarea
                        value={apDesc}
                        onChange={(e) => setApDesc(e.target.value)}
                        placeholder="Ex: Levar pasta sensorial e canetinha colorida para guiar a descompressão."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs transition h-20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus size={16} />
                      Confirmar Agendamento
                    </button>
                  </form>
                </div>

                {/* List appointments */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-base font-bold text-slate-800 mb-2">Seus Agendamentos Clínicos</h4>
                  
                  {appointments.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border-2 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                        item.isCompleted
                          ? 'border-slate-100 bg-slate-50 opacity-60'
                          : 'border-indigo-50 bg-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      
                      <div className="flex items-start gap-3.5">
                        <span className="text-3xl p-2 bg-slate-50 rounded-2xl border">
                          {item.type === 'consulta' ? '🏥' :
                           item.type === 'terapia' ? '👨‍👩‍👧‍👦' :
                           item.type === 'escola' ? '🎒' :
                           item.type === 'medicamento' ? '💊' : '🤝'}
                        </span>
                        
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className={`text-sm font-black ${item.isCompleted ? 'line-through text-slate-500' : 'text-indigo-950'}`}>
                              {item.title}
                            </h5>
                            <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                              {item.type}
                            </span>
                          </div>
                          
                          <p className="text-xs text-indigo-900/80 mt-1 font-semibold">{item.professionalName || 'Profissional não especificado'}</p>
                          <p className="text-slate-400 text-[11px] mt-1 italic">"{item.description}"</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                              📅 HORÁRIO: {new Date(item.dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => toggleAppointment(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            item.isCompleted
                              ? 'bg-slate-300 text-slate-800'
                              : 'bg-[#50C878] text-white hover:bg-emerald-600'
                          }`}
                        >
                          {item.isCompleted ? '✓ Concluído' : 'Realizado'}
                        </button>
                        
                        <button
                          onClick={() => deleteAppointment(item.id)}
                          className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}

                  {appointments.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-slate-400">Nenhum compromisso clínico cadastrado na rede.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: RELATÓRIOS & EXPORT PARA PDF */}
          {activeTab === 'reports' && (
            <div id="tab-reports" className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Relatórios de Evolução Infantil</h3>
                  <p className="text-xs text-slate-500">Mensure taxas de adesão aos brinquedos pedagógicos e gere arquivos consolidados para fonoaudiólogos e médicos.</p>
                </div>
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download size={16} />
                  Exportar Relatório PDF Profissional
                </button>
              </div>

              {/* Dynamic stats values cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase">Atividades na Curadoria</p>
                  <p className="text-2xl font-black text-indigo-950 mt-1">{activities.length}</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase">Ações Concluídas</p>
                  <p className="text-2xl font-black text-green-700 mt-1">{getCompletedCount()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase">Rotinas Assistidas Ativas</p>
                  <p className="text-2xl font-black text-teal-700 mt-1">{routine.length}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase">Diários Descritos</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">{diary.length}</p>
                </div>
              </div>

              {/* Metrics Graphics representation */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200">
                <h4 className="text-base font-bold text-slate-800 mb-4">Mapeamento de Esferas Sensoriais no TEA</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Eficácia de Comunicação e Fala', pct: '75%', color: 'bg-green-500' },
                    { label: 'Estimulação Sensorial e Táctil', pct: '50%', color: 'bg-amber-500' },
                    { label: 'Coordenação Motora Fina', pct: '90%', color: 'bg-teal-500' },
                    { label: 'Autoconsciência Emocional', pct: '40%', color: 'bg-rose-500' },
                    { label: 'Interação Social Pragmática', pct: '60%', color: 'bg-indigo-500' }
                  ].map((it, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{it.label}</span>
                        <span>{it.pct}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${it.color}`} style={{ width: it.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PAINEL ADMINISTRATIVO (ADMIN PANEL) */}
          {activeTab === 'admin' && (
            <div id="tab-admin" className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-sans">Painel de Gerenciamento Clínico (Admin)</h3>
                <p className="text-xs text-slate-500">Módulo exclusivo para Clínicas, Terapeutas e Administradores cadastrarem novas atividades e gerenciarem avisos aos cuidadores.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Form to submit custom actions */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>📝</span>
                    Cadastrar Atividade Personalizada no Index Geral
                  </h4>

                  <form onSubmit={handleAdminActivitySubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título Curto</label>
                        <input
                          type="text"
                          required
                          value={adminTitle}
                          onChange={(e) => setAdminTitle(e.target.value)}
                          placeholder="Ex: Escrita tátil no fubá"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs transition focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Categoria do Autismo</label>
                        <select
                          value={adminCategory}
                          onChange={(e) => setAdminCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        >
                          {CATEGORIES_LIST.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição Concisa (Para os pais)</label>
                      <input
                        type="text"
                        required
                        value={adminDesc}
                        onChange={(e) => setAdminDesc(e.target.value)}
                        placeholder="Ex: Dispor caixa de fubá ou farinha de milho fina para desenhar caminhos de animais."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Faixa Etária Recomendada</label>
                        <input
                          type="text"
                          value={adminAgeRange}
                          onChange={(e) => setAdminAgeRange(e.target.value)}
                          placeholder="Ex: 3 a 7 anos"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Grau de Dificuldade</label>
                        <select
                          value={adminDifficulty}
                          onChange={(e) => setAdminDifficulty(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        >
                          <option value="Fácil">Fácil</option>
                          <option value="Médio">Médio</option>
                          <option value="Difícil">Difícil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tempo Estimado</label>
                        <input
                          type="text"
                          value={adminTime}
                          onChange={(e) => setAdminTime(e.target.value)}
                          placeholder="Ex: 15 min"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Objetivo Clínico-Terapêutico</label>
                      <input
                        type="text"
                        value={adminObjective}
                        onChange={(e) => setAdminObjective(e.target.value)}
                        placeholder="Ex: Diminuir resistência dactilar e incentivar descompressão tátil."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Materiais Necessários (Separados por vírgula)</label>
                      <input
                        type="text"
                        value={adminMaterials}
                        onChange={(e) => setAdminMaterials(e.target.value)}
                        placeholder="Ex: 1 assadeira rasa, Fubá de milho seco, Mini dinossauros"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Passo a Passo Sequencial (Pule linhas para enumerar etapas)</label>
                      <textarea
                        value={adminSteps}
                        onChange={(e) => setAdminSteps(e.target.value)}
                        placeholder="Etapa 1: Disponha o fubá na bandeja de forma uniforme&#10;Etapa 2: Mostre desenhando círculos lentamente&#10;Etapa 3: Deixe o autista explorar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs h-20 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Benefícios Práticos (Separados por vírgula)</label>
                        <input
                          type="text"
                          value={adminBenefits}
                          onChange={(e) => setAdminBenefits(e.target.value)}
                          placeholder="Ex: Propriocepção refinada, Familiarização táctil"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Dica Extra (Manejo)</label>
                        <input
                          type="text"
                          value={adminTips}
                          onChange={(e) => setAdminTips(e.target.value)}
                          placeholder="Ex: Caso haja repúdio inicial ao pó, utilize pequenas colheres de auxílio."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus size={16} />
                      Ativar Atividade na Curadoria Pública
                    </button>
                  </form>
                </div>

                {/* Simulated Push Notification broadcaster */}
                <div className="space-y-6">
                  
                  {/* Push Broadcaster Form */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span>🔔</span>
                      Simulador de Disparo Clínico (Push Notification)
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                      O Mundo Atípico possui comunicação de rede automatizada que avisa os cuidadores sobre eventos ou palavras inspiracionais.
                    </p>

                    <form onSubmit={handleSendCustomPush} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título da Notificação</label>
                        <input
                          type="text"
                          required
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          placeholder="Ex: Dica de Lanche Saudável"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mensagem Disparada</label>
                        <textarea
                          required
                          value={notifMessage}
                          onChange={(e) => setNotifMessage(e.target.value)}
                          placeholder="Ex: Arthur concluiu 3 tarefas visuais hoje! Que tal comemorar com o bloco favorito?"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs h-20 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm"
                      >
                        Transmitir Notificação com Voz (TTS)
                      </button>
                    </form>
                  </div>

                  {/* System metadata logs */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-800 mb-2">Estatísticas Operacionais</h4>
                    <p className="text-xs text-slate-400 mb-4">Métricas internas consolidadas de engajamento do applet.</p>
                    
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                        <span className="font-bold text-slate-500">Usuários Ativos Simulados</span>
                        <span className="font-black text-slate-900 bg-white border rounded px-2.5 py-0.5">3.450 cuidadores</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                        <span className="font-bold text-slate-500">Atividades no Acervo</span>
                        <span className="font-black text-slate-900 bg-white border rounded px-2.5 py-0.5">604 caminhos lúdicos</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                        <span className="font-bold text-slate-500">Notificações Disparadas</span>
                        <span className="font-black text-slate-900 bg-white border rounded px-2.5 py-0.5">14.020 envios</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </main>

        {/* Right Quick Access Rail for Accessibility & Custom configurations */}
        <aside className={`w-18 shrink-0 border-l ${preferences.themeMode === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} hidden xl:flex flex-col items-center py-8 gap-6`}>
          
          {/* Accessibility toggle options */}
          <div className="group relative">
            <button
              onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
              title="Alto Contraste Visual"
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                preferences.highContrast
                  ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Accessibility size={20} />
            </button>
            <span className="absolute bottom-[-30px] right-2 bg-slate-800 text-white text-[9px] font-bold p-1 rounded opacity-0 group-hover:opacity-100 shrink-0 whitespace-nowrap transition cursor-default">
              Acessibilidade
            </span>
          </div>

          {/* FontSize Toggle controller */}
          <div className="group relative">
            <button
              onClick={() => {
                const sizes: ('sm' | 'base' | 'lg' | 'xl')[] = ['sm', 'base', 'lg', 'xl'];
                const currentIdx = sizes.indexOf(preferences.fontSize);
                const nextIdx = (currentIdx + 1) % sizes.length;
                updatePreferences({ fontSize: sizes[nextIdx] });
              }}
              title="Aumentar Fonte"
              className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 flex flex-col items-center justify-center transition"
            >
              <span className="text-xs font-black">A+</span>
              <span className="text-[8px] uppercase">{preferences.fontSize}</span>
            </button>
          </div>

          {/* Theme mode toggling */}
          <div className="group relative">
            <button
              onClick={() => updatePreferences({ themeMode: preferences.themeMode === 'dark' ? 'light' : 'dark' })}
              title="Alternar Modo Claro/Escuro"
              className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition"
            >
              <Smile size={20} />
            </button>
          </div>

        </aside>

      </div>

      {/* ----------------- MODAL DETAILS: ADICIONAR CRIANÇA ----------------- */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 w-full max-w-lg p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAddChildModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h4 className="text-xl font-bold text-slate-900 leading-none">Cadastrar Nova Criança Atípica</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Customize os gostos lúdicos e limites biológicos para calibrar as recomendações inteligentes.</p>
            </div>

            <form onSubmit={handleAddNewChild} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nome Completo / Apelido</label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Ex: Arthur (Tuti)"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Interesses Especiais (Separados por vírgulas)</label>
                <input
                  type="text"
                  value={newChildInterests}
                  onChange={(e) => setNewChildInterests(e.target.value)}
                  placeholder="Ex: Dinos, Legos, Cores primárias, Piano"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Habilidades de Destaque (Separados por vírgula)</label>
                <input
                  type="text"
                  value={newChildSkills}
                  onChange={(e) => setNewChildSkills(e.target.value)}
                  placeholder="Ex: Altamente focado em desenhos, Brincar cooperativo"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Desafios / Barreiras no Cotidiano</label>
                <input
                  type="text"
                  value={newChildChallenges}
                  onChange={(e) => setNewChildChallenges(e.target.value)}
                  placeholder="Ex: Seletividade alimentar de crocantes, Sensível a buzinas"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Objetivos das Terapias Atuais</label>
                <input
                  type="text"
                  value={newChildObjectives}
                  onChange={(e) => setNewChildObjectives(e.target.value)}
                  placeholder="Ex: Contato visual pragmático, Tolerar sujeiras úmidas"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Preferências Sensoriais</label>
                <input
                  type="text"
                  value={newChildSensory}
                  onChange={(e) => setNewChildSensory(e.target.value)}
                  placeholder="Ex: Gosta de pesos pesados nas costas, Rejeita massinha"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Observações Gerais de Apoio</label>
                <textarea
                  value={newChildRemarks}
                  onChange={(e) => setNewChildRemarks(e.target.value)}
                  placeholder="Se houver alguma recomendação específica do neuropediatra, escreva aqui."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs h-16 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                Efetuar Acolhimento e Salvar Perfil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL DETAILS: ACTIVITY DETAILED PASSO A PASSO ----------------- */}
      {activeActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 w-full max-w-2xl p-6 lg:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveActivityModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 border rounded-full p-1 bg-slate-50"
            >
              <X size={20} />
            </button>

            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">
              📂 CATEGORIA: {activeActivityModal.category}
            </span>

            <h4 className="text-2xl font-black text-slate-900 leading-snug">{activeActivityModal.title}</h4>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl">
              {activeActivityModal.description}
            </p>

            <div className="grid grid-cols-3 gap-3 my-4 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tempo Ideal</span>
                <span className="text-xs font-black text-slate-800">⏱️ {activeActivityModal.estimatedTime}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dificuldade</span>
                <span className="text-xs font-black text-indigo-700">📶 {activeActivityModal.difficulty}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Público-Alvo</span>
                <span className="text-xs font-black text-slate-800">👶 {activeActivityModal.ageRange}</span>
              </div>
            </div>

            {/* List materials */}
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1.5">📦 Materiais Necessários:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs">
                  {activeActivityModal.materialsNeeded.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Step by step sequentials */}
              <div>
                <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1.5">👣 Passo a Passo Adaptado a TEA:</p>
                <ol className="list-decimal pl-4 space-y-2 text-slate-700 text-xs leading-relaxed">
                  {activeActivityModal.stepByStep.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Expected clinical benefits */}
              <div>
                <p className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider mb-1.5">🏆 Benefícios Esperados no Desenvolvimento:</p>
                <ul className="list-disc pl-4 space-y-1 text-emerald-950 text-xs">
                  {activeActivityModal.expectedBenefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Therapeutic micro advices */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-slate-800 leading-relaxed">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">💡 Dica Extra Anti-Sobrecarregamento:</p>
                <p className="text-xs text-amber-950 italic">"{activeActivityModal.extraTips}"</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleFavorite(activeActivityModal.id);
                  // Refresh memory inside modal
                  setActiveActivityModal(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                  activeActivityModal.isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {activeActivityModal.isFavorite ? '❤️ Salvo nos Favoritos!' : 'Favoritar Atividade'}
              </button>

              <button
                onClick={() => {
                  toggleCompleted(activeActivityModal.id);
                  setActiveActivityModal(null);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg"
              >
                Marcar como Concluída Concluída ✓
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- MODAL DETAILS: SIMULATION PROFESSIONAL REPORT PDF FORM ----------------- */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border-4 border-teal-500 w-full max-w-2xl p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 border rounded-full p-1 bg-slate-50"
            >
              <X size={20} />
            </button>

            {/* Simulated PDF sheet body with visual alignment and metadata */}
            <div className="p-6 border-2 border-slate-100 bg-slate-50 rounded-2xl font-mono text-xs text-slate-800 space-y-4 shadow-inner">
              
              <div className="flex justify-between items-start border-b-2 border-slate-300 pb-4 flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-sm text-teal-800">PLANO COOPERATIVO DE DESENVOLVIMENTO "MUNDO ATÍPICO"</h3>
                  <p className="text-[10px] text-slate-400 mt-1">EMISSÃO AUTOMÁTICA EM: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="bg-teal-100 text-teal-800 text-[9px] font-black uppercase px-2 py-1 rounded">DOCUMENTO DE REDE</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border text-[11px] leading-relaxed">
                <div>
                  <p><strong>CRIANÇA:</strong> {activeProfile?.name || 'Arthur'}</p>
                  <p><strong>IDADE DA JORNADA:</strong> {activeProfile?.age || 4} anos</p>
                  <p><strong>CUIDADOR VERIFICADO:</strong> {currentUser?.name || 'Mundo Atípico'}</p>
                </div>
                <div>
                  <p><strong>Habilidades Alvo:</strong> {activeProfile?.interests.join(', ') || 'Rotina, Cognição'}</p>
                  <p><strong>Sessões Ativas:</strong> {appointments.length} Eventos Agendados</p>
                  <p><strong>Meta Terapêutica Principal:</strong> {activeProfile?.therapeuticObjectives?.[0] || 'Engajamento'}</p>
                </div>
              </div>

              {/* Activities executed log */}
              <div>
                <p className="font-bold text-slate-900 mb-1 leading-snug">ATIVIDADES CONCLUÍDAS DO ACERVO DE 600 ATIVIDADES:</p>
                <div className="bg-white p-3 rounded-xl border space-y-1">
                  {activities.filter(a => a.isCompleted).map((act, i) => (
                    <div key={i} className="flex justify-between text-[10px] border-b border-dashed pb-1">
                      <span>✓ {act.title} [{act.category}]</span>
                      <span className="font-bold text-green-700">SUCESSO</span>
                    </div>
                  ))}
                  {activities.filter(a => a.isCompleted).length === 0 && (
                    <p className="text-center text-slate-400 py-4 font-sans text-xs">Nenhum brinquedo ou ação finalizada no histórico para exportar.</p>
                  )}
                </div>
              </div>

              {/* Behaviors recorded */}
              <div>
                <p className="font-bold text-slate-900 mb-1 leading-snug">COMPORTAMENTO EVOLUTIVO DE DESTAQUE:</p>
                <div className="bg-white p-3 rounded-xl border space-y-1">
                  {diary.slice(0, 2).map((di, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-1 text-[10px]">
                      <p><strong>Data {di.date}:</strong> {di.progressMade}</p>
                      <p className="text-[9px] text-indigo-700 pt-0.5">ESTADO GERAL: {di.emotionRating.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informative disclaimers inside PDF sheet */}
              <p className="text-[9px] text-amber-800 leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                ⭐ <strong>DECLARAÇÃO:</strong> Este mapeamento foi montado de forma personalizada e serve exclusivamente como subsídio pedagógico e lúdico para profissionais de reabilitação. Não constitui laudo psiquiátrico de qualquer espécie.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  showPushNotification('Sucesso', 'Relatório PDF exportado com sucesso no dispositivo temporário!');
                  setShowPdfModal(false);
                }}
                className="bg-teal-605 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm"
              >
                Transferir PDF Agora
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
