import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const dashboardstyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F8FAFB",
    },

    // Header Section
    headerSection: {
        height: 200,
        position: 'relative',
        overflow: 'hidden',
    },
    
    headerGradient: {
        flex: 1,
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 30,
        justifyContent: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },

    welcomeText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '400',
        marginBottom: 4,
    },

    driverName: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 16,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },

    statusBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
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

    // Location Section
    locationSection: {
        marginBottom: 24,
    },

    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    locationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    destinationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    locationIconText: {
        fontSize: 18,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },

    addressText: {
        fontSize: 15,
        color: '#4A4A4A',
        lineHeight: 22,
        marginBottom: 8,
    },

    lastUpdatedText: {
        fontSize: 12,
        color: '#9E9E9E',
        fontStyle: 'italic',
    },

    // Controls Section
    controlsSection: {
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
        marginLeft: 4,
    },

    controlCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
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
        color: '#1A1A1A',
        marginBottom: 4,
    },

    controlSubtitle: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
    },

    // Navigation
    navButton: {
        padding: 8,
        borderRadius: 12,
    },

    // Deprecated/Legacy styles (keeping for compatibility)
    container: {
        flex: 1,
        backgroundColor: "#F8FAFB",
    },

    mapImage: {
        width: "100%",
        height: 400, 
        position: "absolute",
        top: 0,
        zIndex: -1, 
    },

    card: {
        backgroundColor: "white",
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 15,
        elevation: 5,
        marginTop: 350, 
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
    }
});