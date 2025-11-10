import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, Upload, X, Send } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultations } from '../../contexts/ConsultationsContext';
import Colors from '../../constants/colors';
import type { ConsultationDocument } from '../../types';

export default function NewConsultationScreen() {
  const { user } = useAuth();
  const { createConsultation } = useConsultations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: user?.name || '',
    clientEmail: user?.email || '',
    clientPhone: user?.phone || '',
    caseDetails: '',
  });

  const [documents, setDocuments] = useState<ConsultationDocument[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newDocs: ConsultationDocument[] = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random(),
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size || 0,
        }));
        setDocuments([...documents, ...newDocs]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSubmit = async () => {
    Alert.alert("I'm gay");
  };

  const submitConsultation = async () => {
    setIsSubmitting(true);
    try {
      await createConsultation({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        caseDetails: formData.caseDetails,
        documents,
      });

      Alert.alert(
        'Success',
        'Your consultation request has been submitted. A dental expert will review it shortly.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting consultation:', error);
      Alert.alert('Error',
    `Failed to submit consultation: ${error.message || error.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'New Consultation Request' }} />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textLight}
              value={formData.clientName}
              onChangeText={(text) => setFormData({ ...formData, clientName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={Colors.textLight}
              value={formData.clientEmail}
              onChangeText={(text) => setFormData({ ...formData, clientEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="(555) 123-4567"
              placeholderTextColor={Colors.textLight}
              value={formData.clientPhone}
              onChangeText={(text) => setFormData({ ...formData, clientPhone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Details</Text>
          <Text style={styles.helpText}>
            Provide detailed information about your dental case, including symptoms,
            history, and specific concerns.
          </Text>
          
          <TextInput
            style={styles.textArea}
            placeholder="Describe your case in detail..."
            placeholderTextColor={Colors.textLight}
            value={formData.caseDetails}
            onChangeText={(text) => setFormData({ ...formData, caseDetails: text })}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.helpText}>
            Upload dental records, X-rays, photos, or any relevant documents
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Upload size={24} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>

          {documents.length > 0 && (
            <View style={styles.documentsContainer}>
              {documents.map((doc) => (
                <View key={doc.id} style={styles.documentItem}>
                  <FileText size={20} color={Colors.primary} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeDocument(doc.id)}
                    style={styles.removeButton}
                  >
                    <X size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Consultation</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>
            After submission, a dental expert will review your case and contact you
            to schedule a consultation.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    padding: 20,
    backgroundColor: Colors.surface,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
  },
  uploadButton: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  documentsContainer: {
    marginTop: 16,
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  submitSection: {
    padding: 20,
    backgroundColor: Colors.surface,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  footerNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
