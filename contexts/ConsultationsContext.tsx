import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Consultation, ConsultationStatus } from '../types';
import { useAuth } from './AuthContext';

const CONSULTATIONS_STORAGE_KEY = 'dental_consultations';

export const [ConsultationsProvider, useConsultations] = createContextHook(() => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONSULTATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((c: Consultation) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          scheduledDate: c.scheduledDate ? new Date(c.scheduledDate) : undefined,
        }));
        setConsultations(withDates);
      }
    } catch (error) {
      console.error('Failed to load consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConsultations = async (newConsultations: Consultation[]) => {
    try {
      await AsyncStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(newConsultations));
      setConsultations(newConsultations);
    } catch (error) {
      console.error('Failed to save consultations:', error);
      throw error;
    }
  };

  const createConsultation = useCallback(async (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newConsultation: Consultation = {
      ...consultation,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    };

    const updated = [...consultations, newConsultation];
    await saveConsultations(updated);
    return newConsultation;
  }, [consultations]);

  const updateConsultationStatus = useCallback(async (id: string, status: ConsultationStatus, scheduledDate?: Date) => {
    const updated = consultations.map(c =>
      c.id === id ? { ...c, status, scheduledDate } : c
    );
    await saveConsultations(updated);
  }, [consultations]);

  const filteredConsultations = useMemo(() => {
    if (!user) return [];
    
    if (user.role === 'admin') {
      return consultations;
    }
    
    return consultations.filter(c => c.clientId === user.id);
  }, [consultations, user]);

  const pendingCount = useMemo(
    () => consultations.filter(c => c.status === 'pending').length,
    [consultations]
  );

  return useMemo(() => ({
    consultations: filteredConsultations,
    allConsultations: consultations,
    isLoading,
    pendingCount,
    createConsultation,
    updateConsultationStatus,
  }), [filteredConsultations, consultations, isLoading, pendingCount, createConsultation, updateConsultationStatus]);
});
