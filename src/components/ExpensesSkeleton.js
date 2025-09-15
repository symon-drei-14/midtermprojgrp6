import React from 'react';
import { View, ScrollView } from 'react-native';
import PlaceholderBox from './PlaceholderBox';

const HomeSkeletonCustom = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFB' }}>
      <View style={{ 
        backgroundColor: '#7a0f0f', 
        paddingHorizontal: 24, 
        paddingTop: 50, 
        paddingBottom: 50,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35
      }} />

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 }}
      >
        <View style={{
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.8)",
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center'
                }}>
                <PlaceholderBox style={{ width: 20, height: 20 }} />
                </View>
              <PlaceholderBox style={{ width: 100, height: 18 }} />
            </View>
            <PlaceholderBox style={{ width: 24, height: 24, borderRadius: 4 }} />
          </View>

          <View style={{ marginBottom: 20 }}>
            <PlaceholderBox style={{ width: 150, height: 32 }} />
          </View>

        </View>


        

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 16,
            marginBottom: 30,
            width: '48%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5
        }}>
            <PlaceholderBox style={{ width: 100, height: 15 }} />
            <View style = {{ marginTop: 20 }}>
            <PlaceholderBox style={{ width: 130, height: 25 }} />
            </View>
            <View style = {{ marginTop: 10 }}>
            <PlaceholderBox style = {{ width: 110, height: 10 }} />
            </View>
        </View>

        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 16,
            marginBottom: 30,
            width: '48%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5
        }}>
            <PlaceholderBox style={{ width: 100, height: 15 }} />
            <View style = {{ marginTop: 20 }}>
            <PlaceholderBox style={{ width: 130, height: 25 }} />
            </View>
            <View style = {{ marginTop: 10 }}>
            <PlaceholderBox style = {{ width: 110, height: 10 }} />
            </View>
         </View>
    </View>

        <View style={{ marginBottom: 12 }}>
          <PlaceholderBox style={{ width: 130, height: 18 }} />
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <PlaceholderBox style={{ width: 20, height: 20 }} />
              </View>
              <View style={{ flex: 1 }}>
                <PlaceholderBox style={{ width: 120, height: 16, marginBottom: 4 }} />
                <PlaceholderBox style={{ width: 100, height: 12 }} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <PlaceholderBox style={{ width: 20, height: 20 }} />
              </View>
              <View style={{ flex: 1 }}>
                <PlaceholderBox style={{ width: 120, height: 16, marginBottom: 4 }} />
                <PlaceholderBox style={{ width: 100, height: 12 }} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <PlaceholderBox style={{ width: 20, height: 20 }} />
              </View>
              <View style={{ flex: 1 }}>
                <PlaceholderBox style={{ width: 120, height: 16, marginBottom: 4 }} />
                <PlaceholderBox style={{ width: 100, height: 12 }} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10
      }}>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 35, height: 12 }} />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 30, height: 12 }} />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
          <PlaceholderBox style={{ width: 24, height: 24, marginBottom: 4 }} />
          <PlaceholderBox style={{ width: 40, height: 12 }} />
        </View>
      </View>
    </View>
  );
};

export default HomeSkeletonCustom;