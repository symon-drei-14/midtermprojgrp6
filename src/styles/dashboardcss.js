import { StyleSheet } from "react-native";

export const dashboardstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  redHeader: {
    backgroundColor: "transparent",
  },

  headerCard: {
    backgroundColor: "#7a0f0fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F43F5E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  smallAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  welcomeColumn: {
    flexDirection: "column",
  },

  welcomeSmall: {
    fontSize: 12,
    color: "#FECACA",
  },

  userNameWhite: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  headerRight: {
    alignItems: "flex-end",
  },

  todaySmall: {
    fontSize: 12,
    color: "#FECACA",
  },

  dateTimeSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  statusBadgeCompact: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: '#FFE4E8',
    borderWidth: 1,
    borderColor: '#FAD1D9',
  },

  statusOnline: {},
  statusOffline: {},

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
  },

statsContainer: {
  flexDirection: 'row',
  paddingVertical: 8,
  marginHorizontal: 16,
  marginTop: 16,
  alignItems: 'stretch',
},

statItem: {
  flex: 1,
  alignItems: 'center',
},

separator: {
  width: 1,
  height: '70%',
  backgroundColor: '#E5E7EB',
},

  statLabel: {
  fontSize: 12,
  color: '#6B7280',
  marginTop: 8,
},

iconRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},

statValue: {
  fontSize: 20,
  fontWeight: '700',
  color: '#111827',
  marginTop: 4,
},

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  contentArea: {
    padding: 16,
    paddingTop: 20,
  },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },

  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },

  generateReportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
  },

  generateReportText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  checkInButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    elevation: 2,
  },

  checkInButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  actionIcon: {
    marginRight: 6,
  },

  currentTripCard: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 17,
  },

  currentTripTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  tripHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  tripDestination: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },

  tripSubInfo: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  statusOutlineBadge: {
    borderWidth: 1.5,
    borderColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 8,
    backgroundColor: "transparent",
  },

  statusOutlineText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 14,
    marginBottom: 2,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 12,
  },

  timeColumn: {
    flex: 1,
  },

  timeColumnRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  timeLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  tripCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tripCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  tripIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  tripInfo: {
    flex: 1,
    justifyContent: "center",
  },

  tripTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  tripSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  tripBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tripBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  section: {
    marginTop: 24,
  },

  recentTripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  recentTripItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  recentTripInfo: {
    marginLeft: 12,
    flex: 1,
  },

  recentTripTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  recentTripSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },

  recentTripTime: {
    fontSize: 12,
    color: "#6B7280",
  },

  settingsContainer: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 0,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },

  settingContent: {
    flex: 1,
    marginLeft: 12,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  settingDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  sectionContainer: {
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: 'transparent',
  },

  currentTripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  emptyState: {
    paddingVertical: 16,
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
  },

  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  locationSub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
    marginTop: 2,
    maxWidth: 220,
  },
  locationPill: {
    minWidth: 54,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pillOn: {
    backgroundColor: '#10B981',
  },
  pillOff: {
    backgroundColor: '#E5E7EB',
  },
  locationPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextOn: { color: '#FFFFFF' },
  pillTextOff: { color: '#FFFFFF' },

  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
},
    currentTripItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
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
    statusBadgeSolid: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
    },
    statusBadgeText: {
        color: '#DC2626',
        fontSize: 11,
        fontWeight: '600',
    },
    statusEnRoute: {},
    statusBadgeTextLight: {},
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
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 13,
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