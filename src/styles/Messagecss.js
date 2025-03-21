import { StyleSheet } from "react-native";

export const messagestyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
      },
    
      addButton: {
        padding: 10,
      },
      addText: {
        fontSize: 24,
        color: '#000',
      },
      backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 5,
      },
      backIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
      },
      chatContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
      },
      messageRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      messageRowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 15,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#88efbc',
        marginHorizontal: 10,
      },
      avatar2: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ef88b4',
        marginHorizontal: 10,
      },
      messageBubbleLeft: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
        maxWidth: '70%',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
      },
      messageBubbleRight: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 20,
        maxWidth: '70%',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
      },
      messageText: {
        fontSize: 16,
        color: '#333',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
      },
      input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
      },
      sendButton: {
        padding: 10,
      },
      sendIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
      },
});