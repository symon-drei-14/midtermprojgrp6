import { StyleSheet } from "react-native";

export const profilestyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFB", // Light background for the main body
    },
    scrollContainer: {
        paddingBottom: 80, // Space for bottom navigation
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#7a0f0f', // Dark red header background
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    // NEW style for the <Image> component
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60, // Makes the image circular
        borderWidth: 3,
        borderColor: '#fff',
    },
    // Kept this for the emoji placeholder
    avatar: {
        fontSize: 90,
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: '#7a0f0f',
    },
    editIconText: {
        fontSize: 18,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 5,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    passwordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        fontSize: 20,
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        flexWrap: 'nowrap',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#a62626ff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#7a0f0f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    // --- MODAL STYLES ---
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    passwordInputContainer: {
        flexDirection: "row",
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 10,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 5,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: "row",
        marginTop: 20,
        width: "100%",
    },
    saveButton: {
        backgroundColor: "#2ecc71", // Green for save
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: "#e74c3c", // Red for cancel
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleButton: {
        padding: 10,
    },
    toggleText: {
        color: '#7a0f0f',
        fontWeight: '600',
    },

    // --- NEW STYLES for Image Editing in Modal ---
    modalAvatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: '#e5e7eb', // A light grey for the placeholder background
    },
    changePhotoButton: {
        marginTop: 10,
        backgroundColor: '#f3f4f6',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    changePhotoButtonText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
    },
});