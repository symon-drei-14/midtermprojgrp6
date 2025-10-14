import React from 'react';
import { View, ScrollView } from 'react-native';
import PlaceholderBox from './PlaceholderBox';

const DashboardSkeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View
        style={{
          backgroundColor: '#7a0f0fff',
          paddingHorizontal: 16,
          paddingVertical: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 8,
            marginHorizontal: 16,
            marginTop: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 4,
              alignItems: 'center',
            }}
          >
            <PlaceholderBox
              style={{ width: 22, height: 22, borderRadius: 4, marginBottom: 8 }}
            />
            <PlaceholderBox style={{ width: 80, height: 12, marginBottom: 8 }} />
            <PlaceholderBox style={{ width: 40, height: 20 }} />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginHorizontal: 4,
              alignItems: 'center',
            }}
          >
            <PlaceholderBox
              style={{ width: 22, height: 22, borderRadius: 4, marginBottom: 8 }}
            />
            <PlaceholderBox style={{ width: 100, height: 12, marginBottom: 8 }} />
            <PlaceholderBox style={{ width: 60, height: 20 }} />
          </View>
        </View>

        <View style={{ padding: 16, paddingTop: 20 }}>

          <PlaceholderBox style={{ width: 120, height: 18, marginBottom: 12 }} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
              gap: 12,
            }}
          >
            <PlaceholderBox style={{ flex: 1, height: 48, borderRadius: 24 }} />
            <PlaceholderBox style={{ flex: 1, height: 48, borderRadius: 24 }} />
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaceholderBox
                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 12 }}
              />
              <View>
                <PlaceholderBox style={{ width: 120, height: 14, marginBottom: 4 }} />
                <PlaceholderBox style={{ width: 160, height: 12 }} />
              </View>
            </View>
            <PlaceholderBox style={{ width: 54, height: 30, borderRadius: 15 }} />
          </View>

          <View style={{ paddingHorizontal: 0, paddingTop: 14, paddingBottom: 6 }}>
            <PlaceholderBox style={{ width: 100, height: 18, marginBottom: 12 }} />

            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PlaceholderBox
                  style={{ width: 36, height: 36, borderRadius: 18, marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <PlaceholderBox style={{ width: 150, height: 16, marginBottom: 6 }} />
                  <PlaceholderBox style={{ width: 120, height: 13 }} />
                </View>
                <PlaceholderBox style={{ width: 70, height: 28, borderRadius: 20 }} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 24,
                }}
              >
                <View>
                  <PlaceholderBox style={{ width: 60, height: 11, marginBottom: 4 }} />
                  <PlaceholderBox style={{ width: 70, height: 13 }} />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <PlaceholderBox style={{ width: 40, height: 11, marginBottom: 4 }} />
                  <PlaceholderBox style={{ width: 80, height: 13 }} />
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 0, paddingTop: 14, paddingBottom: 6 }}>
            <PlaceholderBox style={{ width: 100, height: 18, marginBottom: 12 }} />

            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              {[1, 2, 3].map((_, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    borderBottomWidth: index !== 2 ? 1 : 0,
                    borderBottomColor: '#E5E7EB',
                  }}
                >
                  <PlaceholderBox
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <PlaceholderBox style={{ width: 140, height: 15, marginBottom: 4 }} />
                    <PlaceholderBox style={{ width: 100, height: 13 }} />
                  </View>
                </View>
              ))}
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
        {[40, 70, 40, 45].map((w, i) => (
          <View
            key={i}
            style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}
          >
            <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
            <PlaceholderBox style={{ width: w, height: 12 }} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default DashboardSkeleton;