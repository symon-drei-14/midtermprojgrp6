import { StyleSheet, Dimensions, Platform } from "react-native";

export const dashboardstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    header: {
        backgroundColor: '#7a0f0fff',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    welcomeSection: {
        flex: 1,
    },
    
    welcomeText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 2,
    },
    
    userName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    
    headerControls: {
        flexDirection: 'row',
        gap: 16,
    },
    
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    headerButtonText: {
        fontSize: 20,
    },
    
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    
    statusOffline: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    
    statusOnline: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    
    statusText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: '600',
    },
    
    timeSection: {
        alignItems: 'flex-end',
    },
    
    todayText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 2,
    },
    
    timeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },

    content: {
        flex: 1,
        marginTop: -16,
    },
    
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        paddingTop: 20,
    },

    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    
    cardTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    walletIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    
    walletIcon: {
        width: 24,
        height: 24,
    },
    
    navigationIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    
    navigationIcon: {
        fontSize: 20,
    },
    
    cardTitle: {
        fontSize: 18,
        color: '#1F2937',
        fontWeight: '500',
    },
    
    chevronButton: {
        padding: 8,
        borderRadius: 8,
    },
    
    chevronText: {
        color: '#9CA3AF',
        fontSize: 20,
        fontWeight: '300',
    },

    balanceSection: {
        marginBottom: 24,
    },
    
    balanceAmount: {
        fontSize: 36,
        color: '#059669',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    
    lastUpdatedText: {
        fontSize: 14,
        color: '#6B7280',
    },
    
    generateButton: {
        backgroundColor: '#059669',
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    
    generateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    tripInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    truckIconContainer: {
        width: 48,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    truckIcon: {
        width: 28,
        height: 20,
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    
    tripDetails: {
        flex: 1,
    },
    
    tripDestination: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
        marginBottom: 4,
    },
    
    tripSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    
    activeBadge: {
        backgroundColor: '#DBEAFE',
        borderColor: '#93C5FD',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    
    activeBadgeText: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: '600',
    },

    sectionHeader: {
        marginBottom: 12,
    },
    
    sectionTitle: {
        fontSize: 18,
        color: '#374151',
        fontWeight: '500',
        paddingLeft: 4,
    },

    trackingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    trackingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    locationIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    locationIcon: {
        fontSize: 24,
    },
    
    trackingText: {
        flex: 1,
    },
    
    trackingLabel: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
        marginBottom: 2,
    },
    
    trackingStatus: {
        fontSize: 14,
        color: '#6B7280',
    },
    
    switch: {
        transform: [{ scale: 1.1 }],
    },

    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(226, 232, 240, 0.5)',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    
    navButton: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 16,
        minWidth: 60,
    },
    
    navButtonActive: {
        backgroundColor: '#DBEAFE',
        transform: [{ scale: 1.05 }],
    },
    
    navIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    
    navIconImg: {
        width: 24,
        height: 24,
        marginBottom: 4,
    },
    
    navLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    
    navLabelActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },

    mainContainer: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },

    headerSection: {
        height: 220,
        position: 'relative',
        overflow: 'hidden',
    },
    
    headerGradient: {
        flex: 1,
        backgroundColor: '#7a0f0fff',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
        justifyContent: 'space-between',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#3B5EF1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },

    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileEmoji: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },

    settingsButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    settingsIcon: {
        color: 'white',
        fontSize: 20,
    },

    driverName: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 16,
    },

    statusBadgeText: {
        color: '#FF5722',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    dateTimeContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },

    dateTimeText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
        lineHeight: 20,
    },

    scrollContainer: {
        flex: 1,
        marginTop: -20,
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    balanceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    balanceIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    balanceIcon: {
        fontSize: 20,
    },

    balanceHeader: {
        flex: 1,
    },

    balanceTitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },

    balanceAmountContainer: {
        marginBottom: 4,
    },

    arrowButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrow: {
        color: '#9CA3AF',
        fontSize: 18,
        fontWeight: '300',
    },

    reportButton: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    reportButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    locationSection: {
        marginBottom: 24,
    },

    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },

    locationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    locationIconText: {
        fontSize: 20,
    },

    addressText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },

    activeTag: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    activeTagText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },

    controlsSection: {
        marginBottom: 24,
    },

    controlCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    controlHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    controlInfo: {
        flex: 1,
        marginRight: 16,
    },

    controlTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },

    controlSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },

    trackingIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    trackingIcon: {
        fontSize: 20,
    },

    trackingContent: {
        flex: 1,
    },

    miniStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 'auto',
    },

    onlineStatus: {
        color: '#10B981',
    },

    offlineStatus: {
        color: '#EF4444',
    },

    eyeButton: {
        padding: 8,
        borderRadius: 8,
    },

    eyeIcon: {
        fontSize: 16,
        color: '#6B7280',
    },

    label: {
        fontSize: 14,
        color: "#888",
        marginTop: 10,
    },

    input: {
        fontSize: 16,
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginBottom: 10,
    },

    coordinates: {
        fontSize: 14,
        fontFamily: "monospace",
        marginTop: 5,
    },

    bottomNav2: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.08)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
});

export const modernStyles = StyleSheet.create({
    gradientBackground: {
        background: 'linear-gradient(135deg, #3B5EF1 0%, #8B5CF6 100%)',
    },

    cardElevation: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    
    cardElevationHigh: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },

    headingLarge: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    
    headingMedium: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    
    bodyText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
    },
    
    captionText: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    statusOnlineVariant: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10B981',
        color: '#10B981',
    },
    
    statusOfflineVariant: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#EF4444',
        color: '#EF4444',
    },
    
    statusWarning: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#F59E0B',
        color: '#F59E0B',
    },

      checkInButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        // removed margin from here to apply it directly in the component
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    checkInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

     queueIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FEF3C7', // A nice warm yellow for the queue status
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    queueIcon: {
        fontSize: 24,
    },

    notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
},

    notificationIconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
},

    notificationIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
},

    notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
},

    notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
},
});

