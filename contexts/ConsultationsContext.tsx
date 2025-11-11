import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useMemo } from 'react';
import type { ConsultationStatus } from '../types';
import { useAuth } from './AuthContext';
import { trpc } from '@/lib/trpc';

export const [ConsultationsProvider, useConsultations] = createContextHook(() => {
  const { user } = useAuth();
  
  const listQuery = trpc.consultations.list.useQuery(
    user?.role === 'client' ? { clientId: user.id } : undefined,
    {
      refetchInterval: 5000,
    }
  );

  const createMutation = trpc.consultations.create.useMutation({
    onSuccess: () => {
      listQuery.refetch();
    },
  });

  const updateStatusMutation = trpc.consultations.updateStatus.useMutation({
    onSuccess: () => {
      listQuery.refetch();
    },
  });

  const createConsultation = useCallback(async (consultation: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    caseDetails: string;
    documents: {
      id: string;
      name: string;
      uri: string;
      type: string;
      size: number;
    }[];
  }) => {
    console.log('🟡 Creating consultation with data:', JSON.stringify(consultation, null, 2));
    try {
      const result = await createMutation.mutateAsync(consultation);
      console.log('✅ Consultation created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to create consultation:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      throw error;
    }
  }, [createMutation]);

  const updateConsultationStatus = useCallback(async (id: string, status: ConsultationStatus, scheduledDate?: Date) => {
    console.log('Updating consultation status:', id, status);
    await updateStatusMutation.mutateAsync({ 
      id, 
      status, 
      scheduledDate: scheduledDate ? scheduledDate.toISOString() : undefined 
    });
  }, [updateStatusMutation]);

  const consultations = useMemo(() => {
    if (!listQuery.data) return [];
    return listQuery.data;
  }, [listQuery.data]);

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
    isLoading: listQuery.isLoading,
    pendingCount,
    createConsultation,
    updateConsultationStatus,
  }), [filteredConsultations, consultations, listQuery.isLoading, pendingCount, createConsultation, updateConsultationStatus]);
});
