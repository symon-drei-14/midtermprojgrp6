import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const tripstyle = StyleSheet.create({
  // Main Container
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContent: {
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },

  // Header Section
  headerSection: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    marginTop: -20,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Section Containers
  sectionContainer: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  countBadge: {
    backgroundColor: '#E3F2FD',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  countText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '700',
  },

  // Active Trip Card
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  cardHeader: {
    marginBottom: 20,
  },

  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  destinationIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  destinationText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },

  // Trip Details
  tripDetails: {
    marginBottom: 24,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  detailLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    flex: 1,
  },

  detailValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },

  cashValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '700',
    flex: 2,
    textAlign: 'right',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  primaryButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#FF9800',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Scheduled Trip Cards
  scheduledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  scheduledDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },

  pendingBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pendingText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  scheduledDetails: {
    marginTop: 12,
  },

  scheduledLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },

  cashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },

  cashAdvanceLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },

  cashAdvanceValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '700',
  },

  // Empty States
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },

  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },

  modalButtons: {
    gap: 12,
    marginBottom: 20,
  },

  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  enRouteButton: {
    backgroundColor: '#FF9800',
  },

  completedButton: {
    backgroundColor: '#4CAF50',
  },

  noShowButton: {
    backgroundColor: '#F44336',
  },

  modalButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  modalCancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },

  modalCancelText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },

  // Navigation
  navButton: {
    padding: 8,
    borderRadius: 12,
  },

  // Legacy Styles (for compatibility)
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  tripCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },

  tripContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  value: {
    fontSize: 16,
    color: '#333',
  },

  tripTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 14,
    color: "#444",
    marginVertical: 5,
  },

  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  updateButton: {
    backgroundColor: "#C8F4C4",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },

  expenseButton: {
    backgroundColor: "#FCE9C9",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },

  futureTripsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },

  futureTripCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EEE",
    paddingVertical: 15,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  navLabel: {
    fontSize: 14,
    color: "#444",
  },
});