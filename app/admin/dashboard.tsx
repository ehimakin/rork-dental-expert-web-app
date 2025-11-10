import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { FileText, Clock, Calendar, CheckCircle, X } from 'lucide-react-native';
import { useConsultations } from '../../contexts/ConsultationsContext';
import Colors from '../../constants/colors';
import type { Consultation, ConsultationStatus } from '../../types';

const STATUS_CONFIG: Record<
  ConsultationStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: 'Pending', color: Colors.statusPending, icon: Clock },
  scheduled: { label: 'Scheduled', color: Colors.statusScheduled, icon: Calendar },
  completed: { label: 'Completed', color: Colors.statusCompleted, icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: Colors.statusCancelled, icon: X },
};

export default function AdminDashboardScreen() {
  const { allConsultations, updateConsultationStatus, pendingCount } = useConsultations();
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSchedule = async () => {
    if (!selectedConsultation || !scheduleDate || !scheduleTime) {
      Alert.alert('Error', 'Please fill in date and time');
      return;
    }

    try {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      await updateConsultationStatus(selectedConsultation.id, 'scheduled', scheduledDateTime);
      
      Alert.alert('Success', 'Consultation scheduled successfully');
      setShowScheduleModal(false);
      setSelectedConsultation(null);
      setScheduleDate('');
      setScheduleTime('');
    } catch {
      Alert.alert('Error', 'Failed to schedule consultation');
    }
  };

  const handleStatusUpdate = async (consultation: Consultation, status: ConsultationStatus) => {
    if (status === 'scheduled') {
      setSelectedConsultation(consultation);
      setShowScheduleModal(true);
      return;
    }

    try {
      await updateConsultationStatus(consultation.id, status);
      Alert.alert('Success', `Consultation marked as ${status}`);
    } catch {
      Alert.alert('Error', 'Failed to update consultation status');
    }
  };

  const renderConsultationCard = (consultation: Consultation) => {
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
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={styles.date}>
            {consultation.createdAt.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{consultation.clientName}</Text>
          <Text style={styles.clientContact}>{consultation.clientEmail}</Text>
          {consultation.clientPhone && (
            <Text style={styles.clientContact}>{consultation.clientPhone}</Text>
          )}
        </View>

        <View style={styles.caseDetails}>
          <Text style={styles.caseLabel}>Case Details:</Text>
          <Text style={styles.caseText} numberOfLines={3}>
            {consultation.caseDetails}
          </Text>
        </View>

        {consultation.documents.length > 0 && (
          <View style={styles.documentsInfo}>
            <FileText size={14} color={Colors.primary} />
            <Text style={styles.documentsText}>
              {consultation.documents.length} document(s) attached
            </Text>
          </View>
        )}

        {consultation.scheduledDate && (
          <View style={styles.scheduledInfo}>
            <Calendar size={14} color={Colors.primary} />
            <Text style={styles.scheduledText}>
              {consultation.scheduledDate.toLocaleDateString()} at{' '}
              {consultation.scheduledDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}

        {consultation.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.scheduleButton]}
              onPress={() => handleStatusUpdate(consultation, 'scheduled')}
            >
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleStatusUpdate(consultation, 'cancelled')}
            >
              <X size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {consultation.status === 'scheduled' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusUpdate(consultation, 'completed')}
            >
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {allConsultations.filter(c => c.status === 'scheduled').length}
            </Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {allConsultations.filter(c => c.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Consultations</Text>
          {allConsultations.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No consultations yet</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {allConsultations
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(renderConsultationCard)}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showScheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Consultation</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowScheduleModal(false);
                  setSelectedConsultation(null);
                }}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="2024-12-25"
                placeholderTextColor={Colors.textLight}
                value={scheduleDate}
                onChangeText={setScheduleDate}
              />

              <Text style={styles.modalLabel}>Time (HH:MM)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="14:30"
                placeholderTextColor={Colors.textLight}
                value={scheduleTime}
                onChangeText={setScheduleTime}
              />

              <TouchableOpacity
                style={styles.scheduleConfirmButton}
                onPress={handleSchedule}
              >
                <Calendar size={20} color="#FFFFFF" />
                <Text style={styles.scheduleConfirmText}>Confirm Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  list: {
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
  clientInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  clientContact: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  caseDetails: {
    marginBottom: 12,
  },
  caseLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  caseText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  documentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  documentsText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  scheduledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: Colors.primary + '10',
    borderRadius: 6,
    marginBottom: 12,
  },
  scheduledText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButton: {
    backgroundColor: Colors.info,
  },
  cancelButton: {
    backgroundColor: Colors.error,
  },
  completeButton: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  scheduleConfirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  scheduleConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
