import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { FileText, Calendar, CheckCircle, LogOut, User } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/colors';

export default function HomeScreen() {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  const features = [
    {
      icon: FileText,
      title: 'Submit Case',
      description: 'Upload dental records and case details for expert review',
      action: () => router.push('/consultations/new'),
      color: Colors.primary,
      show: !isAdmin,
    },
    {
      icon: Calendar,
      title: 'My Consultations',
      description: 'View and manage your consultation requests',
      action: () => router.push('/consultations'),
      color: Colors.info,
      show: !isAdmin,
    },
    {
      icon: FileText,
      title: 'Review Cases',
      description: 'Review pending consultation requests from clients',
      action: () => router.push('/admin/dashboard'),
      color: Colors.primary,
      show: isAdmin,
    },
    {
      icon: CheckCircle,
      title: 'Completed Cases',
      description: 'View your consultation history',
      action: () => router.push('/admin/dashboard'),
      color: Colors.success,
      show: isAdmin,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userBadge}>
            <User size={24} color={Colors.primary} />
          </View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {isAdmin ? '🦷 Dental Expert' : '👤 Client'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isAdmin ? 'Expert Dashboard' : 'Quick Actions'}
          </Text>
          <View style={styles.featuresGrid}>
            {features
              .filter((f) => f.show)
              .map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.featureCard}
                    onPress={feature.action}
                  >
                    <View
                      style={[
                        styles.featureIconContainer,
                        { backgroundColor: feature.color + '20' },
                      ]}
                    >
                      <Icon size={28} color={feature.color} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Our Service</Text>
          <Text style={styles.infoText}>
            Our platform connects clients with experienced dental experts for
            professional consultation and expert witness services. Get reliable
            opinions on dental cases, treatment evaluations, and expert testimony.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Availability</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Expert</Text>
              <Text style={styles.statLabel}>Dentists</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Secure</Text>
              <Text style={styles.statLabel}>Platform</Text>
            </View>
          </View>
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
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  userBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoSection: {
    margin: 24,
    marginTop: 8,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
});
