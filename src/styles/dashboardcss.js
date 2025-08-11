import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const dashboardstyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    
    headerSection: {
        height: 180, 
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20, 
    },
    
     headerGradient: {
        flex: 1,
        backgroundColor: '#7a0f0fff', 
        paddingHorizontal: 24,
        paddingTop: 100, 
        paddingBottom: 25,
        justifyContent: 'flex-end', 
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#0D47A1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        width: '100%',
        position: 'relative', 
    },
    headerTextContainer: {
  marginTop: 10,
},

      welcomeText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500', 
        marginBottom: 4,
    },

     driverName: {
        fontSize: 32, 
        color: '#FFFFFF',
        fontWeight: '800', 
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
     statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        alignSelf: 'flex-start',
        
    },
   
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },

    statusBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    profileContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 60,
        right: 24,
        zIndex: 10,
        },

    profilePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
         right: 24,
        },

    profileEmoji: {
        fontSize: 24,
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

    // Enhanced Balance Card Styles
      balanceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.15)',
        marginTop: 10, 
    },


    balanceHeader: {
        marginBottom: 16,
    },

    balanceTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    balanceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },

    eyeButton: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },

    eyeIcon: {
        fontSize: 16,
    },

    balanceAmountContainer: {
        marginBottom: 20,
    },

      balanceAmount: {
        fontSize: 36, 
        fontWeight: '800', 
        color: '#1B5E20',
        letterSpacing: -0.8,
        marginVertical: 8,
    },

    balanceActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

        reportButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },

        reportButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
  
    },

    // Location Section
    locationSection: {
        marginBottom: 24,
    },

    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 22,
        marginBottom: 16,
        shadowColor: '#1565C0',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.1)',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

   locationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
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
        fontSize: 20,
    },


    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D47A1',
    },

    addressText: {
        fontSize: 16,
        color: '#424242',
        lineHeight: 24,
        marginBottom: 12,
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
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.03)',
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
        fontSize: 17,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 2,
    },

    controlSubtitle: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
    },

    // Navigation
       navButton: {
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
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
    },

  
dateTimeContainer: {
  position: 'absolute',
  bottom: 28,
  right: 20,
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: 16,
  fontWeight: '500',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
},
dateTimeText: {
  color: '#FFF',
  fontSize: 14,
  fontWeight: '500',
  textAlign: 'right',
},





});

export const additionalDashboardStyles = StyleSheet.create({
    
    miniStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 'auto',
    },
    
    
    controlSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
        fontWeight: '400',
    },
    
    
    statusText: {
        fontSize: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    
    onlineStatus: {
        color: '#4CAF50',
    },
    
   
    offlineStatus: {
        color: '#FF5722',
    },
    
    
    enhancedStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginTop: 8,
    },
    
    
    statusSeparator: {
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 4,
        fontSize: 8,
    },
});