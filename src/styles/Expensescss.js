import { StyleSheet } from "react-native";

export const expensestyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8fafc",
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  header: {
    background: "linear-gradient(135deg, #7a0f0fff 0%, #7a0f0fff 100%)",
    backgroundColor: "#7a0f0fff",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#7a0f0fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },

  dropdownTextWrapper: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},


  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  statusMessage: {
    backgroundColor: '#f8f9ff',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5f2',
  },
  statusMessageIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statusMessageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusMessageSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },

  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },

  refreshIcon: {
    fontSize: 20,
  },

  scrollView: {
    flex: 1,
    paddingTop: 20,
  },

  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  primaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },

  primaryCardLabel: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },

  primaryCardAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },

  budgetBreakdown: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  budgetBreakdownText: {
    fontSize: 13,
    color: "#475569",
    marginVertical: 2,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },

  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },

  overBudgetCard: {
    borderLeftColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  statAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },

  overBudgetText: {
    color: "#ef4444",
  },

  expenseSection: {
    paddingHorizontal: 20,
    marginBottom: 120,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },

  expenseList: {
    gap: 12,
  },

  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.5)",
  },

  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  expenseIcon: {
    fontSize: 20,
  },

  expenseDetails: {
    flex: 1,
  },

  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  expenseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },

  receiptIndicator: {
    fontSize: 14,
    color: "#7a0f0fff",
    marginLeft: 8,
  },

  expenseDate: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },

  tripInfo: {
    fontSize: 12,
    color: "#7a0f0fff",
    fontStyle: "italic",
  },

  amountContainer: {
    alignItems: "flex-end",
  },

  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
  },

  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },

  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7a0f0fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7a0f0fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  fabIcon: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "300",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCloseIcon: {
    fontSize: 16,
    color: "#64748b",
  },

  modalContent: {
    paddingHorizontal: 20,
  },

  balanceAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },

  balanceAlertIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  balanceAlertText: {
    fontSize: 16,
    color: "#0c4a6e",
    fontWeight: "600",
  },

  inputGroup: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },

  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginTop: 8,
  },

  quickAmountSection: {
    marginBottom: 24,
  },

  quickAmountLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  quickAmountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  quickAmountButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  quickAmountButtonDisabled: {
    backgroundColor: "#f9fafb",
    opacity: 0.5,
  },

  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  quickAmountTextDisabled: {
    color: "#9ca3af",
  },

  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
  },

  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "transparent",
  },

  dropdownText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },

  dropdownArrow: {
    fontSize: 14,
    color: "#6b7280",
    transform: [{ rotate: "0deg" }],
  },

  dropdownArrowRotated: {
    transform: [{ rotate: "180deg" }],
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  dropdownItemSelected: {
    backgroundColor: "#f0f9ff",
  },

  dropdownItemIcon: {
    fontSize: 16,
    marginRight: 12,
  },

  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },

  dropdownItemTextSelected: {
    color: "#0ea5e9",
    fontWeight: "600",
  },

  imageUploadButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  imageUploadContent: {
    alignItems: "center",
  },

  imageUploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  imageUploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },

  imageUploadSubtext: {
    fontSize: 14,
    color: "#6b7280",
  },

  imagePreviewContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  removeImageIcon: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },

  imageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f1f5f9",
  },

  imageInfoText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  buttonGroup: {
    gap: 12,
    marginTop: 24,
    paddingBottom: 20,
  },

  submitButton: {
    backgroundColor: "#7a0f0fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#7a0f0fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },

  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },

  historyContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    width: 320,
  },

  newBalanceSection: {
    padding: 20,
    paddingTop: 10,
  },
  
  totalBudgetCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  budgetIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  walletIcon: {
    width: 24,
    height: 24,
  },
  
  budgetIconText: {
    fontSize: 16,
  },
  
  totalBudgetLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  
  totalBudgetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  
  budgetBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  budgetBreakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  
  budgetBreakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  
  statsCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  
  spentCard: {
    flex: 1,
    backgroundColor: '#ffebee',
    borderRadius: 16,
    padding: 16,
  },
  
  remainingCard: {
    flex: 1,
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    padding: 16,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  spentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef5350',
    marginRight: 8,
  },
  
  remainingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  
  spentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef5350',
    marginBottom: 4,
  },
  
  remainingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  
  spentPercentage: {
    fontSize: 12,
    color: '#666',
  },
  
  remainingPercentage: {
    fontSize: 12,
    color: '#666',
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },

  dropdownList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
  },

  dropdownScrollView: {
    maxHeight: 200,
  },
  
  receiptModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  receiptModalImage: {
    width: '100%',
    height: '80%',
  },
  receiptModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  receiptModalCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  changeImageText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },

  deleteButton: {
  backgroundColor: "#fee2e2",
  borderWidth: 1,
  borderColor: "#ef4444",
  borderRadius: 12,
  padding: 16,
  alignItems: "center",
},
deleteButtonText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#b91c1c",
},
});