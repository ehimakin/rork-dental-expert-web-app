import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FileText, Clock, CheckCircle, Calendar } from 'lucide-react-native';
import { useConsultations } from '../../contexts/ConsultationsContext';
import Colors from '../../constants/colors';
import type { ConsultationStatus } from '../../types';

const STATUS_CONFIG: Record<
  ConsultationStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: 'Pending Review',
    color: Colors.statusPending,
    icon: Clock,
  },
  scheduled: {
    label: 'Scheduled',
    color: Colors.statusScheduled,
    icon: Calendar,
  },
  completed: {
    label: 'Completed',
    color: Colors.statusCompleted,
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: Colors.statusCancelled,
    icon: Clock,
  },
};

export default function ConsultationsScreen() {
  const { consultations, isLoading } = useConsultations();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading consultations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Consultation Requests</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push('/consultations/new')}
        >
          <FileText size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New Request</Text>
        </TouchableOpacity>
      </View>

      {consultations.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No Consultations Yet</Text>
          <Text style={styles.emptyText}>
            Submit your first consultation request to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/consultations/new')}
          >
            <Text style={styles.emptyButtonText}>Create Consultation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.list}>
          {consultations.map((consultation) => {
            const statusConfig = STATUS_CONFIG[consultation.status];
            const StatusIcon = statusConfig.icon;

            return (
              <View key={consultation.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig.color + '20' },
                    ]}
                  >
                    <StatusIcon size={16} color={statusConfig.color} />
                    <Text
                      style={[styles.statusText, { color: statusConfig.color }]}
                    >
                      {statusConfig.label}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {consultation.createdAt.toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {consultation.caseDetails}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerLabel}>Client:</Text>
                  <Text style={styles.footerValue}>
                    {consultation.clientName}
                  </Text>
                </View>

                {consultation.documents.length > 0 && (
                  <View style={styles.documentsInfo}>
                    <FileText size={14} color={Colors.textSecondary} />
                    <Text style={styles.documentsText}>
                      {consultation.documents.length} document(s) attached
                    </Text>
                  </View>
                )}

                {consultation.scheduledDate && (
                  <View style={styles.scheduledInfo}>
                    <Calendar size={14} color={Colors.primary} />
                    <Text style={styles.scheduledText}>
                      Scheduled for{' '}
                      {consultation.scheduledDate.toLocaleDateString()} at{' '}
                      {consultation.scheduledDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  newButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 6,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  documentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  documentsText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scheduledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.primary + '10',
    borderRadius: 6,
  },
  scheduledText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
