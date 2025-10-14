import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const tripstyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },

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

  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    resizeMode: 'contain',
  },

  headerSection: {
    backgroundColor: '#7a0f0fff',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#7a0f0fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

 headerTitle: {
   fontSize: 26,
   color: '#E0E0E0',
   fontWeight: 'bold',
   fontFamily: 'Helvetica Neue',
 },
  dateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

sectionContainer: {
  paddingHorizontal: 0,
  marginBottom: 20,
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

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  countBadge: {
    backgroundColor: '#e68c8c85',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  countText: {
    color: '#750606ff',
    fontSize: 12,
    fontWeight: '700',
  },

activeCard: {
  width: '110%',
  marginTop: 10,
  marginLeft: -16,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 8,
},

  cardHeader: {
    marginBottom: 20,
  },

  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  locationIconContainer: {
    marginRight: 8,
  },

  walletIcon: {
    width: 16,
    height: 16,
    tintColor: '#dc2626',
  },

  destinationLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 2,
  },

  destinationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

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
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '700',
    flex: 2,
    textAlign: 'right',
  },

  actionButtons: {
    marginTop: 0,
    flexDirection: 'row',
    gap: 12,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#f97316',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  scheduledTripCard: {
    width: '110%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginHorizontal: 0,
    marginLeft: -16,
  },

  scheduledTripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scheduledTripInfo: {
    flex: 1,
  },

  scheduledTripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  scheduledTripDate: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '400',
  },

  scheduledTripStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduledStatusText: {
    fontSize: 12,
    color: '#0c3da7ff',
    backgroundColor: '#6da5ee65',
    fontWeight: '500',
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden', 
    flexDirection: "row",
    alignItems: "center",
  },

  arrowIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  arrowText: {
    fontSize: 14,
    color: "#2563eb",
    marginLeft: 4,
  },

  tripDetailModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },

  tripDetailContent: {
    maxHeight: '70%',
  },

  closeButton: {
    position: 'absolute',
    right: 0,
    top: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 48,
    marginBottom: 24,
    marginTop: 24,
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

  modernModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modernModalContainer: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 24,
  width: '90%',
  maxWidth: 340,
  alignItems: 'center',
  position: 'relative',
},
modernModalClose: {
  position: 'absolute',
  top: 16,
  right: 16,
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#F3F4F6',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
modernModalIcon: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#FEE2E2',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  marginTop: 8,
},
modernModalTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#1F2937',
  marginBottom: 8,
  textAlign: 'center',
},
modernModalSubtitle: {
  fontSize: 14,
  color: '#6B7280',
  marginBottom: 24,
  textAlign: 'center',
},
modernCompleteButton: {
  backgroundColor: '#10B981',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 24,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},
modernCompleteButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
modernCancelButton: {
  paddingVertical: 12,
},
modernCancelText: {
  color: '#6B7280',
  fontSize: 15,
  fontWeight: '500',
},

modalButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
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
    backgroundColor: '#f97316',
  },

  completedButton: {
    backgroundColor: '#4CAF50',
  },

  noShowButton: {
    backgroundColor: '#dc2626',
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
    backgroundColor: '#6b7280',
    borderRadius: 12,
  },

  modalCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  checklistButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  
  checklistButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  checklistQuestion: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  
  checklistInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: 'center',
  },

  checklistSubmittedButton: {
    backgroundColor: '#2563eb',
  },
  
  checklistSubmittedText: {
    color: 'white',
  },

  checklistDisabledButton: {
    backgroundColor: '#ccc',
  },
  
  checklistDisabledText: {
    color: '#666',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 20,
  },

navButton: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
},
navButtonActive: {
},
  navIconContainer: {
  position: 'relative',
  width: 34,
  height: 34,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
},
navIconActiveBg: {
  backgroundColor: '#FFE4E8',
  borderRadius: 10,
},
navBadge: {
  position: 'absolute',
  top: -4,
  right: -6,
  backgroundColor: '#dc2626',
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  paddingHorizontal: 4,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#fff',
},
navBadgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
  textAlign: 'center',
},
navLabel: {
  fontSize: 12,
  fontWeight: '500',
},

  detailIcon: {
  width: 16,
  height: 16,
  marginRight: 6,
  resizeMode: "contain",
},


  scheduledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
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
    alignSelf: 'flex-start',
    marginTop: 10,
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
    flexShrink: 0,
  },

  destinationHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  destinationInfo: {
    flex: 1,
    marginLeft: 8,
  },

  locationIcon: {
    width: 18,
    height: 18,
    tintColor: '#dc2626',
  },

  scheduledBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  scheduledBadgeText: {
    color: '#2196F3',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

    section: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
    sectionContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
tripCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 4,
},
    currentTripItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tripInfo: {
        flex: 1,
        marginLeft: 16,
    },
tripDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
},
tripSubInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'uppercase',
},
    statusOutlineBadge: {
        borderWidth: 1,
        borderColor: '#2563EB',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusOutlineText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '500',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    timeColumn: {},
    timeColumnRight: {
        alignItems: 'flex-end',
    },
    timeLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    }
});

export const TripDetail = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
scrollContent: {
  paddingHorizontal: 20,
  paddingBottom: 100,
},
  destinationHeader: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: '#dc2626',
    marginRight: 12,
  },
  destinationLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scheduledBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  scheduledText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  timeIcon: {
    width: 20,
    height: 20,
    marginBottom: 8,
    tintColor: '#666',
  },
  timeLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  detailsList: {
    gap: 0,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#666',
  },
  detailLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  detailCashValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000ff',
    textAlign: 'right',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

   startButtonEnRoute: {
    backgroundColor: '#f97316',
  },

  startButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#dc2626',
  },
};