import React from 'react';
import { View, ScrollView } from 'react-native';
import PlaceholderBox from './PlaceholderBox';

const NotificationSkeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <View
        style={{
          backgroundColor: '#7a0f0fff',
          paddingTop: 10,
          paddingBottom: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 15,
          }}
        >
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingTop: 10,
            backgroundColor: '#7a0f0fff',
          }}
        >
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 80 }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            marginVertical: 6,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#F0F0F0',
          }}
        >
          <View style={{ flexDirection: 'row', padding: 16 }}>
            <PlaceholderBox
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 14 }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
              >
                <PlaceholderBox style={{ flex: 1, height: 16, marginRight: 8 }} />
                <PlaceholderBox style={{ width: 10, height: 10, borderRadius: 5 }} />
              </View>
              <PlaceholderBox style={{ width: '90%', height: 14, marginBottom: 6 }} />
              <PlaceholderBox style={{ width: '70%', height: 14, marginBottom: 10 }} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <PlaceholderBox style={{ width: 60, height: 12 }} />
                <PlaceholderBox style={{ width: 16, height: 16, borderRadius: 4 }} />
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 40, height: 12 }} />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 70, height: 12 }} />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 40, height: 12 }} />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 45, height: 12 }} />
        </View>
      </View>
    </View>
  );
};

export default NotificationSkeleton;