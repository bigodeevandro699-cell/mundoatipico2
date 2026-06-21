/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChildProfile,
  Activity,
  RoutineTask,
  DiaryEntry,
  Appointment,
  UserPreferences
} from '../types';
import { SEED_ACTIVITIES } from '../data/activities';

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: { email: string; name: string } | null;
  preferences: UserPreferences;
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  activities: Activity[];
  routine: RoutineTask[];
  diary: DiaryEntry[];
  appointments: Appointment[];
  isLoading: boolean;
  isAiLoading: boolean;
  aiMessage: string;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isDownloading: boolean;
  downloadProgress: number;
  downloadOfflineData: () => Promise<void>;
  syncOfflineQueue: () => Promise<void>;
  offlineQueueCount: number;
  addXp: (childId: string, amount: number, actionName: string) => Promise<void>;
  login: (email: string, name: string) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setActiveChild: (id: string) => void;
  addProfile: (profile: Omit<ChildProfile, 'id' | 'age'>) => Promise<void>;
  updateProfile: (id: string, updated: Partial<ChildProfile>) => Promise<void>;
  toggleFavorite: (activityId: string) => void;
  toggleCompleted: (activityId: string) => void;
  addRoutineTask: (task: Omit<RoutineTask, 'id' | 'isCompleted'>) => Promise<void>;
  toggleRoutineTask: (id: string) => Promise<void>;
  deleteRoutineTask: (id: string) => Promise<void>;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'isCompleted'>) => Promise<void>;
  toggleAppointment: (id: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  requestAiRecommendations: () => Promise<void>;
  addCustomActivity: (activity: Omit<Activity, 'id' | 'isFavorite' | 'isCompleted'>) => Promise<void>;
  showPushNotification: (title: string, message: string) => void;
  activeNotification: { title: string; message: string } | null;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'base',
    highContrast: false,
    themeMode: 'light'
  });

  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<ChildProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [routine, setRoutine] = useState<RoutineTask[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // AI Recommendation States
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');

  // Simulation push notification state
  const [activeNotification, setActiveNotification] = useState<{ title: string; message: string } | null>(null);

  // Offline and Sync states
  const [isOnline, setIsOnlineState] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Initialize offline queues and state
  useEffect(() => {
    // Check local Auth
    const remembered = localStorage.getItem('mundo_atipico_auth');
    if (remembered) {
      const parsed = JSON.parse(remembered);
      setIsAuthenticated(true);
      setCurrentUser({ email: parsed.email, name: parsed.displayName || 'Acompanhante Atípico' });
    }

    // Check custom settings
    const localPrefs = localStorage.getItem('mundo_atipico_prefs');
    if (localPrefs) {
      setPreferences(JSON.parse(localPrefs));
    }

    // Load connection status
    const networkState = localStorage.getItem('mundo_atipico_is_online');
    if (networkState !== null) {
      setIsOnlineState(networkState === 'true');
    }

    // Load saved offline queue
    const savedQueue = localStorage.getItem('mundo_atipico_offline_queue');
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue));
    }

    fetchDatabase();
  }, []);

  const setIsOnline = (online: boolean) => {
    setIsOnlineState(online);
    localStorage.setItem('mundo_atipico_is_online', String(online));
    if (online) {
      showPushNotification('Rede Conectada', 'Você está online novamente! Iniciando sincronização automática de dados...');
      // Sync on recovery
      setTimeout(() => {
        syncOfflineQueue();
      }, 800);
    } else {
      showPushNotification('Modo Offline Ativado', 'O aplicativo está rodando em modo local. Todas as alterações serão sincronizadas ao conectar.');
    }
  };

  const fetchDatabase = async () => {
    setIsLoading(true);

    const onlineMode = localStorage.getItem('mundo_atipico_is_online') !== 'false';

    if (!onlineMode) {
      // Offline fallback: load from cached snapshot
      const cachedProfiles = localStorage.getItem('mundo_atipico_cached_profiles');
      const cachedRoutine = localStorage.getItem('mundo_atipico_cached_routine');
      const cachedDiary = localStorage.getItem('mundo_atipico_cached_diary');
      const cachedAppointments = localStorage.getItem('mundo_atipico_cached_appointments');
      const cachedActivities = localStorage.getItem('mundo_atipico_cached_activities');

      if (cachedProfiles) setProfiles(JSON.parse(cachedProfiles));
      if (cachedRoutine) setRoutine(JSON.parse(cachedRoutine));
      if (cachedDiary) setDiary(JSON.parse(cachedDiary));
      if (cachedAppointments) setAppointments(JSON.parse(cachedAppointments));
      if (cachedActivities) setActivities(JSON.parse(cachedActivities));

      // Auto set active profile if cached
      if (cachedProfiles) {
        const parsed = JSON.parse(cachedProfiles);
        if (parsed.length > 0) {
          setActiveProfile(parsed[0]);
        }
      }

      setIsLoading(false);
      return;
    }

    try {
      // Profiles
      const profRes = await fetch('/api/profiles');
      const profData = await profRes.json();
      if (profData.profiles && profData.profiles.length > 0) {
        setProfiles(profData.profiles);
        // Default to first profile
        setActiveProfile(profData.profiles[0]);
      } else {
        setProfiles([]);
        setActiveProfile(null);
      }

      // Routine Visual
      const routRes = await fetch('/api/routine');
      const routData = await routRes.json();
      if (routData.routine) {
        setRoutine(routData.routine);
      }

      // Diaries
      const diaryRes = await fetch('/api/diary');
      const diaryData = await diaryRes.json();
      if (diaryData.diary) {
        setDiary(diaryData.diary);
      }

      // Appointments
      const apRes = await fetch('/api/appointments');
      const apData = await apRes.json();
      if (apData.appointments) {
        setAppointments(apData.appointments);
      }

      // Custom activities from Admin
      const custActRes = await fetch('/api/custom-activities');
      const custActData = await custActRes.json();
      if (custActData.customActivities && custActData.customActivities.length > 0) {
        setActivities(prev => {
          const merged = [...prev];
          custActData.customActivities.forEach((ca: Activity) => {
            if (!merged.find(m => m.id === ca.id)) {
              merged.push(ca);
            }
          });
          return merged;
        });
      }

      // Update offline snapshot on success to guarantee offline readyness
      localStorage.setItem('mundo_atipico_cached_activities', JSON.stringify(activities));
      localStorage.setItem('mundo_atipico_cached_profiles', JSON.stringify(profData.profiles || []));
      localStorage.setItem('mundo_atipico_cached_routine', JSON.stringify(routData.routine || []));
      localStorage.setItem('mundo_atipico_cached_diary', JSON.stringify(diaryData.diary || []));
      localStorage.setItem('mundo_atipico_cached_appointments', JSON.stringify(apData.appointments || []));

    } catch (err) {
      console.warn('API error during initialization. Proceeding with fully robust local mock databases.', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync queued items automatically
  const syncOfflineQueue = async () => {
    const savedQueue = localStorage.getItem('mundo_atipico_offline_queue');
    const queueToSync = savedQueue ? JSON.parse(savedQueue) : [];
    if (queueToSync.length === 0) return;

    showPushNotification('🔄 Sincronizando', `Recuperamos a conexão! Sincronizando ${queueToSync.length} dados de rotinas e conquistas do servidor.`);
    
    // Create clones of local state to reconcile
    let currentProfiles = [...profiles];
    let currentRoutine = [...routine];
    let currentDiary = [...diary];
    let currentAppointments = [...appointments];
    let currentActivities = [...activities];

    for (const item of queueToSync) {
      try {
        if (item.type === 'add-profile') {
          const res = await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.profile) {
            currentProfiles = currentProfiles.map(p => p.id === item.tempId ? data.profile : p);
          }
        } else if (item.type === 'update-profile') {
          const res = await fetch(`/api/profiles/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.profile) {
            currentProfiles = currentProfiles.map(p => p.id === item.id ? data.profile : p);
          }
        } else if (item.type === 'add-routine') {
          const res = await fetch('/api/routine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.task) {
            currentRoutine = [...currentRoutine.filter(r => r.id !== item.tempId), data.task];
          }
        } else if (item.type === 'toggle-routine') {
          await fetch(`/api/routine/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCompleted: item.completed })
          });
        } else if (item.type === 'delete-routine') {
          await fetch(`/api/routine/${item.id}`, {
            method: 'DELETE'
          });
        } else if (item.type === 'add-diary') {
          const res = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.diary) {
            currentDiary = [data.diary, ...currentDiary.filter(d => d.id !== item.tempId)];
          }
        } else if (item.type === 'add-appointment') {
          const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.appointment) {
            currentAppointments = [...currentAppointments.filter(a => a.id !== item.tempId), data.appointment];
          }
        } else if (item.type === 'toggle-appointment') {
          await fetch(`/api/appointments/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCompleted: item.completed })
          });
        } else if (item.type === 'delete-appointment') {
          await fetch(`/api/appointments/${item.id}`, {
            method: 'DELETE'
          });
        } else if (item.type === 'add-custom-activity') {
          const res = await fetch('/api/custom-activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          const data = await res.json();
          if (data.success && data.activity) {
            currentActivities = [data.activity, ...currentActivities.filter(a => a.id !== item.tempId)];
          }
        }
      } catch (err) {
        console.warn('Sync failed for item:', item, err);
      }
    }

    // Refresh states and cache
    setProfiles(currentProfiles);
    setRoutine(currentRoutine);
    setDiary(currentDiary);
    setAppointments(currentAppointments);
    setActivities(currentActivities);

    if (currentProfiles.length > 0) {
      const activeMatch = currentProfiles.find(p => activeProfile && p.id === activeProfile.id) || currentProfiles[0];
      setActiveProfile(activeMatch);
    }

    setOfflineQueue([]);
    localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify([]));
    showPushNotification('✓ Sincronização Sucedida', 'Todas as suas atividades e diários preenchidos foram salvos na nuvem!');
  };

  // Download snapshot for 100% offline access
  const downloadOfflineData = async () => {
    setIsDownloading(true);
    setDownloadProgress(10);
    
    // Simple animated progress simulation
    for (const prog of [25, 55, 80, 100]) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setDownloadProgress(prog);
    }

    localStorage.setItem('mundo_atipico_cached_activities', JSON.stringify(activities));
    localStorage.setItem('mundo_atipico_cached_profiles', JSON.stringify(profiles));
    localStorage.setItem('mundo_atipico_cached_routine', JSON.stringify(routine));
    localStorage.setItem('mundo_atipico_cached_diary', JSON.stringify(diary));
    localStorage.setItem('mundo_atipico_cached_appointments', JSON.stringify(appointments));

    setIsDownloading(false);
    showPushNotification('✓ Download Offline Concluído', `${activities.length} Atividades e ${routine.length} Tarefas de Rotina prontas para uso 100% desconectado.`);
  };

  // Gamification: Point-earning engine & Medal check milestones
  const addXp = async (childId: string, amount: number, actionName: string) => {
    const profile = profiles.find(p => p.id === childId);
    if (!profile) return;

    const currPoints = profile.points || 0;
    const newPoints = currPoints + amount;

    // Check achievement milestones
    const completedActCount = activities.filter(a => a.isCompleted).length;
    const completedRoutineCount = routine.filter(r => r.childId === childId && r.isCompleted).length;
    const diaryLogCount = diary.filter(d => d.childId === childId).length;

    const unlocked: string[] = profile.achievements || [];
    const newUnlocked = [...unlocked];

    const tryUnlock = (id: string, name: string, icon: string) => {
      if (!newUnlocked.includes(id)) {
        newUnlocked.push(id);
        showPushNotification('🎖️ Nova Medalha!', `${profile.name} desbloqueou a conquista: "${name}" ${icon}!`);
      }
    };

    // Evaluate Milestone requirements
    if (completedActCount >= 0) { // triggered on first try
      tryUnlock('first-step', 'Primeiro Passo', '🥇');
    }
    if (completedActCount >= 5) {
      tryUnlock('explorer', 'Explorador de Atividades', '🥈');
    }
    if (completedActCount >= 10) {
      tryUnlock('champion', 'Grande Campeão', '🏆');
    }
    if (completedRoutineCount >= 5) {
      tryUnlock('routine-master', 'Mestre do Ritmo', '📅');
    }
    if (diaryLogCount >= 3) {
      tryUnlock('diary-attentive', 'Coração Atento', '📝');
    }
    if (diaryLogCount >= 7) {
      tryUnlock('diary-golden', 'Consistência de Ouro', '🔥');
    }

    const updatedProfile: ChildProfile = {
      ...profile,
      points: newPoints,
      achievements: newUnlocked
    };

    // Update in memory state
    setProfiles(prev => prev.map(p => p.id === childId ? updatedProfile : p));
    if (activeProfile && activeProfile.id === childId) {
      setActiveProfile(updatedProfile);
    }

    if (isOnline) {
      try {
        await fetch(`/api/profiles/${childId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: newPoints, achievements: newUnlocked })
        });
      } catch (e) {
        console.warn('Failed to update points on backend, queuing...', e);
      }
    } else {
      // Save queue
      setOfflineQueue(prev => {
        // Debounce/remove previous updates for the same profile to avoid queue clog
        const clean = prev.filter(item => !(item.type === 'update-profile' && item.id === childId));
        const updated = [...clean, {
          type: 'update-profile',
          id: childId,
          data: { points: newPoints, achievements: newUnlocked }
        }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
    }

    showPushNotification(`Progresso (+${amount} XP)`, `${profile.name} expandiu o nível por: ${actionName}`);
  };

  // Login handler
  const login = (email: string, name: string) => {
    setIsAuthenticated(true);
    setCurrentUser({ email, name });
    localStorage.setItem('mundo_atipico_auth', JSON.stringify({ email, displayName: name }));
    showPushNotification('Acolhimento Concluído', `Bem-vinda, ${name}! Seu coração está seguro conosco.`);
    fetchDatabase();
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setProfiles([]);
    setActiveProfile(null);
    localStorage.removeItem('mundo_atipico_auth');
    showPushNotification('Até breve', 'Sua sessão foi encerrada com segurança.');
  };

  // Custom Push notification simulator
  const showPushNotification = (title: string, message: string) => {
    setActiveNotification({ title, message });
    // Trigger native browser voice synthesis of the notification warning for maximum sensory accessibility!
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${title}. ${message}`);
      utterance.lang = 'pt-BR';
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearNotification = () => {
    setActiveNotification(null);
  };

  // Preference Settings Updater
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const merged = { ...prev, ...prefs };
      localStorage.setItem('mundo_atipico_prefs', JSON.stringify(merged));
      return merged;
    });
  };

  // Set selected child profile
  const setActiveChild = (id: string) => {
    const selected = profiles.find(p => p.id === id);
    if (selected) {
      setActiveProfile(selected);
      showPushNotification('Perfil Alterado', `Agora você está acompanhando o desenvolvimento de ${selected.name}`);
    }
  };

  // Add child profile
  const addProfile = async (profileData: Omit<ChildProfile, 'id' | 'age'>) => {
    const calculateAge = (dateString: string) => {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const tempId = `profile-${Date.now()}`;
    const payload = {
      ...profileData,
      age: calculateAge(profileData.birthDate),
      points: 0,
      achievements: ['first-step'] // First step granted initially!
    };

    const localNew: ChildProfile = {
      ...payload,
      id: tempId
    };

    // Optimistically update front-end
    setProfiles(prev => [...prev, localNew]);
    setActiveProfile(localNew);

    if (isOnline) {
      try {
        const res = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.profile) {
          // Replace temp with real ID
          setProfiles(prev => prev.map(p => p.id === tempId ? data.profile : p));
          setActiveProfile(data.profile);
          showPushNotification('Criança Cadastrada', `O perfil de ${data.profile.name} foi criado com muito carinho.`);
        }
      } catch (err) {
        // fallback to queue
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'add-profile', tempId, data: payload }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      // Offline mode saving
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'add-profile', tempId, data: payload }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Perfil Salvo Offline', `O perfil de ${localNew.name} foi guardado localmente e sincronizará quando online.`);
    }
  };

  // Update profile
  const updateProfile = async (id: string, updatedData: Partial<ChildProfile>) => {
    // Optimistic
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } as ChildProfile : p));
    if (activeProfile && activeProfile.id === id) {
      setActiveProfile(prev => prev ? { ...prev, ...updatedData } as ChildProfile : null);
    }

    if (isOnline) {
      try {
        const res = await fetch(`/api/profiles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        const data = await res.json();
        if (data.success && data.profile) {
          setProfiles(prev => prev.map(p => p.id === id ? data.profile : p));
          setActiveProfile(data.profile);
          showPushNotification('Perfil Atualizado', 'As informações importantes foram salvas.');
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'update-profile', id, data: updatedData }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'update-profile', id, data: updatedData }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Alterações Salvas Offline', 'As alterações do perfil serão sincronizadas.');
    }
  };

  // Favoritando atividade
  const toggleFavorite = (activityId: string) => {
    setActivities(prev =>
      prev.map(act => (act.id === activityId ? { ...act, isFavorite: !act.isFavorite } : act))
    );
  };

  // Concluindo atividade (triggers points reward!)
  const toggleCompleted = (activityId: string) => {
    let title = '';
    setActivities(prev => {
      const updated = prev.map(act => {
        if (act.id === activityId) {
          const newState = !act.isCompleted;
          title = act.title;
          if (newState) {
            showPushNotification('Excelente Conclusão!', `Você concluiu a atividade "${act.title}". Um passo lindo de evolução!`);
            if (activeProfile) {
              setTimeout(() => {
                addXp(activeProfile.id, 15, `Atividade: ${act.title}`);
              }, 120);
            }
          }
          return { ...act, isCompleted: newState };
        }
        return act;
      });
      return updated;
    });
  };

  // Visual Routine triggers
  const addRoutineTask = async (taskData: Omit<RoutineTask, 'id' | 'isCompleted'>) => {
    const tempId = `routine-${Date.now()}`;
    const localTask: RoutineTask = {
      ...taskData,
      id: tempId,
      isCompleted: false
    };

    setRoutine(prev => [...prev, localTask]);

    if (isOnline) {
      try {
        const res = await fetch('/api/routine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const data = await res.json();
        if (data.success && data.task) {
          setRoutine(prev => [...prev.filter(r => r.id !== tempId), data.task]);
          showPushNotification('Rotina Atualizada', `Tarefa "${taskData.title}" adicionada às ${taskData.time}.`);
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'add-routine', tempId, data: taskData }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'add-routine', tempId, data: taskData }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Tarefa Salva Offline', `"${taskData.title}" salva offline e agendada para sincronismo.`);
    }
  };

  const toggleRoutineTask = async (id: string) => {
    const target = routine.find(r => r.id === id);
    if (!target) return;
    const newCompleted = !target.isCompleted;
    
    setRoutine(prev => prev.map(t => t.id === id ? { ...t, isCompleted: newCompleted } : t));

    if (newCompleted && activeProfile) {
      setTimeout(() => {
        addXp(activeProfile.id, 5, `Tarefa de rotina: ${target.title}`);
      }, 100);
    }

    if (isOnline) {
      try {
        const res = await fetch(`/api/routine/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isCompleted: newCompleted })
        });
        const data = await res.json();
        if (data.success && data.task) {
          setRoutine(prev => prev.map(t => t.id === id ? data.task : t));
          if (newCompleted) {
            showPushNotification('Conquista de Rotina!', `Arthur/Criança concluiu a tarefa: "${target?.title}". Sensacional! 🎉`);
          }
        }
      } catch (err) {
        setOfflineQueue(prev => {
          // Remove potential duplicate toggles of the same task from the queue
          const filtered = prev.filter(p => !(p.type === 'toggle-routine' && p.id === id));
          const updated = [...filtered, { type: 'toggle-routine', id, completed: newCompleted }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const filtered = prev.filter(p => !(p.type === 'toggle-routine' && p.id === id));
        const updated = [...filtered, { type: 'toggle-routine', id, completed: newCompleted }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteRoutineTask = async (id: string) => {
    setRoutine(prev => prev.filter(t => t.id !== id));

    if (isOnline) {
      try {
        const res = await fetch(`/api/routine/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          // done
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'delete-routine', id }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'delete-routine', id }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Diary entries (+10 XP)
  const addDiaryEntry = async (entryData: Omit<DiaryEntry, 'id'>) => {
    const tempId = `diary-${Date.now()}`;
    const localDiary: DiaryEntry = {
      ...entryData,
      id: tempId,
      date: entryData.date || new Date().toISOString().split('T')[0]
    };

    setDiary(prev => [localDiary, ...prev]);

    if (activeProfile) {
      setTimeout(() => {
        addXp(activeProfile.id, 10, 'Registro de Diário Sensorial');
      }, 120);
    }

    if (isOnline) {
      try {
        const res = await fetch('/api/diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        const data = await res.json();
        if (data.success && data.diary) {
          setDiary(prev => [data.diary, ...prev.filter(d => d.id !== tempId)]);
          showPushNotification('Diário Registrado', `Relato salvo! Acompanhar o comportamento guia intervenções mais assertivas.`);
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'add-diary', tempId, data: entryData }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'add-diary', tempId, data: entryData }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Relato Diário Salvo', 'As anotações sensoriais foram gravadas offline.');
    }
  };

  // Calendar Therapy
  const addAppointment = async (apData: Omit<Appointment, 'id' | 'isCompleted'>) => {
    const tempId = `appointment-${Date.now()}`;
    const localAp: Appointment = {
      ...apData,
      id: tempId,
      isCompleted: false
    };

    setAppointments(prev => [...prev, localAp]);

    if (isOnline) {
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apData)
        });
        const data = await res.json();
        if (data.success && data.appointment) {
          setAppointments(prev => [...prev.filter(a => a.id !== tempId), data.appointment]);
          const formattedTime = new Date(apData.dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          showPushNotification('Compromisso Agendado', `"${apData.title}" cadastrado com sucesso para ${formattedTime}.`);
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'add-appointment', tempId, data: apData }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'add-appointment', tempId, data: apData }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Agenda Salva Offline', `"${apData.title}" agendado localmente.`);
    }
  };

  const toggleAppointment = async (id: string) => {
    const target = appointments.find(a => a.id === id);
    if (!target) return;
    const newCompleted = !target.isCompleted;

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, isCompleted: newCompleted } : a));

    if (isOnline) {
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isCompleted: newCompleted })
        });
        const data = await res.json();
        if (data.success && data.appointment) {
          setAppointments(prev => prev.map(a => a.id === id ? data.appointment : a));
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const filtered = prev.filter(p => !(p.type === 'toggle-appointment' && p.id === id));
          const updated = [...filtered, { type: 'toggle-appointment', id, completed: newCompleted }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const filtered = prev.filter(p => !(p.type === 'toggle-appointment' && p.id === id));
        const updated = [...filtered, { type: 'toggle-appointment', id, completed: newCompleted }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));

    if (isOnline) {
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          // done
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'delete-appointment', id }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'delete-appointment', id }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Add customized activities by therapist or administrator
  const addCustomActivity = async (activityData: Omit<Activity, 'id' | 'isFavorite' | 'isCompleted'>) => {
    const tempId = `custom-activity-${Date.now()}`;
    const localAct: Activity = {
      ...activityData,
      id: tempId,
      isFavorite: false,
      isCompleted: false
    };

    setActivities(prev => [localAct, ...prev]);

    if (isOnline) {
      try {
        const res = await fetch('/api/custom-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activityData)
        });
        const data = await res.json();
        if (data.success && data.activity) {
          setActivities(prev => [data.activity, ...prev.filter(a => a.id !== tempId)]);
          showPushNotification('Atividade Cadastrada', `"${activityData.title}" adicionada com sucesso à biblioteca!`);
        }
      } catch (err) {
        setOfflineQueue(prev => {
          const updated = [...prev, { type: 'add-custom-activity', tempId, data: activityData }];
          localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setOfflineQueue(prev => {
        const updated = [...prev, { type: 'add-custom-activity', tempId, data: activityData }];
        localStorage.setItem('mundo_atipico_offline_queue', JSON.stringify(updated));
        return updated;
      });
      showPushNotification('Atividade Salva Offline', `"${activityData.title}" salva localmente.`);
    }
  };

  // Intelligent Recommendation triggering Gemini API through our fullstack Express server!
  const requestAiRecommendations = async () => {
    if (!activeProfile) {
      showPushNotification('Erro', 'Selecione ou cadastre o perfil de uma criança primeiro.');
      return;
    }

    if (!isOnline) {
      showPushNotification('Motor Offline', 'O motor IA do Gemini requer conexão de rede ativa. Conecte o simulador de internet para usar!');
      return;
    }

    setIsAiLoading(true);
    setAiMessage('Profissionais de IA analisando o perfil sensorial e lúdico de ' + activeProfile.name + '...');

    const loadingStages = [
      'Iniciando conexão inteligente com o cérebro do Mundo Atípico...',
      'Mapeando canais de hipersensibilidade tátil e motora fina...',
      'Especialista em pedagogia especial estruturando microprocessos lúdicos...',
      'Estudando objetivos terapêuticos e interesses em ' + activeProfile.interests.join(', ') + '...',
      'Criando passo a passo adaptativo sem sobrecarga familiar...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingStages.length) {
        setAiMessage(loadingStages[step]);
        step++;
      }
    }, 2500);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile })
      });
      const data = await response.json();

      clearInterval(interval);

      if (data.activities && data.activities.length > 0) {
        // Merge generated activities at the top of active list
        setActivities(prev => {
          // Remove potential duplicates
          const filtered = prev.filter(p => !data.activities.some((newAct: any) => newAct.title === p.title));
          return [...data.activities, ...filtered];
        });
        
        if (data.usingFallback) {
          showPushNotification(
            'Recomendações Prontas (Offline)',
            `Nossa inteligência gerou duas sugestões incríveis focadas na autonomia e motricidade para efervescer a evolução!`
          );
        } else {
          showPushNotification(
            'Recomendação Sob Medida',
            `O Gemini calculou 3 novas atividades personalizadas perfeitas para os objetivos de ${activeProfile.name}!`
          );
        }
      }
    } catch (err) {
      clearInterval(interval);
      showPushNotification('Erro de Conexão', 'Não conseguimos contatar a inteligência clínica no momento.');
    } finally {
      setIsAiLoading(false);
      setAiMessage('');
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        offlineQueueCount: offlineQueue.length,
        addXp,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
