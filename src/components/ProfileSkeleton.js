import React from 'react';
import { View, ScrollView } from 'react-native';
import PlaceholderBox from './PlaceholderBox';

const ProfileSkeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View
          style={{
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 30,
            backgroundColor: '#7a0f0fff',
          }}
        >
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            paddingTop: 20,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#F3F4F6',
            }}
          >
            <PlaceholderBox
              style={{ width: 20, height: 20, borderRadius: 4, marginRight: 8 }}
            />
            <PlaceholderBox style={{ width: 140, height: 16 }} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <PlaceholderBox
              style={{ width: 24, height: 20, borderRadius: 4, marginRight: 16 }}
            />
            <PlaceholderBox style={{ width: 150, height: 15 }} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <PlaceholderBox
              style={{ width: 24, height: 20, borderRadius: 4, marginRight: 16 }}
            />
            <PlaceholderBox style={{ flex: 1, height: 15, marginRight: 12 }} />
            <PlaceholderBox style={{ width: 70, height: 28, borderRadius: 16 }} />
          </View>


          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <PlaceholderBox
              style={{ width: 24, height: 20, borderRadius: 4, marginRight: 16 }}
            />
            <PlaceholderBox style={{ flex: 1, height: 15, marginRight: 12 }} />
            <PlaceholderBox style={{ width: 50, height: 28, borderRadius: 16 }} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <PlaceholderBox
              style={{ width: 24, height: 20, borderRadius: 4, marginRight: 16 }}
            />
            <PlaceholderBox style={{ flex: 1, height: 15, marginRight: 12 }} />
            <PlaceholderBox style={{ width: 80, height: 15 }} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 20 }}>
          <PlaceholderBox
            style={{
              height: 48,
              borderRadius: 12,
              marginBottom: 16,
            }}
          />

          <PlaceholderBox
            style={{
              height: 48,
              borderRadius: 12,
            }}
          />
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

export default ProfileSkeleton;