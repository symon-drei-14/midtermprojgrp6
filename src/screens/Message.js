import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { messagestyle } from "../styles/Messagecss";
import back from "../assets/back.png"; 
import send from "../assets/send.png"; 

const Message = () => {
  const nav = useNavigation();
  const [message, setMessage] = useState('');

  return (
    <View style={messagestyle.container}>
      {/* Back Button */}
      <TouchableOpacity style={messagestyle.backButton} onPress={() => nav.goBack()}>
        <Image source={back} style={messagestyle.backIcon} />
      </TouchableOpacity>

      {/* Messages */}
      <View style={messagestyle.chatContainer}>
        {/* Received Message */}
        <View style={messagestyle.messageRowLeft}>
          <View style={messagestyle.avatar} />
          <View style={messagestyle.messageBubbleLeft}>
            <Text style={messagestyle.messageText}>Asan ka na boss</Text>
          </View>
        </View>

        {/* Sent Message */}
        <View style={messagestyle.messageRowRight}>
          <View style={messagestyle.messageBubbleRight}>
            <Text style={messagestyle.messageText}>Sir ma lalate ako</Text>
          </View>
          <View style={messagestyle.avatar2} />
        </View>
      </View>

      {/* Input Field */}
      <View style={messagestyle.inputContainer}>
        <TextInput
          style={messagestyle.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={messagestyle.sendButton}>
          <Image source={send} style={messagestyle.sendIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={messagestyle.addButton}>
          <Text style={messagestyle.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Message;
