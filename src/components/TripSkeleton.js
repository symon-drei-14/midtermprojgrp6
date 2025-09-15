import React from 'react';
import { View } from 'react-native';
import PlaceholderBox from './PlaceholderBox';

const TripSkeletonCustom = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFB' }}>
      {/* Keep the actual header without skeleton animation */}
      <View style={{ 
        backgroundColor: '#7a0f0fff', 
        paddingHorizontal: 24, 
        paddingTop: 50, 
        paddingBottom: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Header content will be rendered by the actual TripScreen */}
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {/* Active Trip Card Skeleton */}
        <View style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: 15, 
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8
        }}>
          <View style={{ marginBottom: 20 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start' 
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <PlaceholderBox style={{ 
                    width: 16, 
                    height: 16, 
                    marginRight: 8 
                  }} />
                  <View style={{ flex: 1 }}>
                    <PlaceholderBox style={{ 
                      width: 60, 
                      height: 12, 
                      marginBottom: 4 
                    }} />
                    <PlaceholderBox style={{ 
                      width: 120, 
                      height: 16 
                    }} />
                  </View>
                </View>
              </View>
              <PlaceholderBox style={{ 
                width: 80, 
                height: 28, 
                borderRadius: 15,
                backgroundColor: '#FFF3E0'
              }} />
            </View>
          </View>

          {/* Trip Details Skeleton */}
          <View style={{ marginBottom: 24 }}>
            {Array.from({ length: 9 }).map((_, index) => (
              <View key={index} style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: index < 8 ? 1 : 0,
                borderBottomColor: '#F5F5F5'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <PlaceholderBox style={{ 
                    width: 16, 
                    height: 16, 
                    marginRight: 6 
                  }} />
                  <PlaceholderBox style={{ 
                    width: Math.random() * 40 + 60, 
                    height: 14 
                  }} />
                </View>
                <PlaceholderBox style={{ 
                  width: Math.random() * 60 + 40, 
                  height: 14 
                }} />
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons Skeleton */}
        <View style={{ 
          flexDirection: 'row', 
          gap: 12,
          marginBottom: 20
        }}>
          <PlaceholderBox style={{ 
            flex: 1, 
            height: 44, 
            borderRadius: 8,
            backgroundColor: '#2563eb'
          }} />
          <PlaceholderBox style={{ 
            flex: 1, 
            height: 44, 
            borderRadius: 8,
            backgroundColor: '#f97316'
          }} />
        </View>

        {/* Scheduled Trips Section Skeleton */}
        <View>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 4
          }}>
            <PlaceholderBox style={{ 
              width: 140, 
              height: 20 
            }} />
            <PlaceholderBox style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12,
              backgroundColor: '#e68c8c85'
            }} />
          </View>

          {/* Scheduled Trip Cards Skeleton */}
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 8, 
              padding: 16,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: '#f3f4f6'
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <View style={{ flex: 1 }}>
                  <PlaceholderBox style={{ 
                    width: Math.random() * 60 + 120, 
                    height: 16, 
                    marginBottom: 4 
                  }} />
                  <PlaceholderBox style={{ 
                    width: 80, 
                    height: 12 
                  }} />
                </View>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center' 
                }}>
                  <PlaceholderBox style={{ 
                    width: 70, 
                    height: 20, 
                    borderRadius: 10,
                    backgroundColor: '#6da5ee65',
                    marginRight: 8
                  }} />
                  <PlaceholderBox style={{ 
                    width: 12, 
                    height: 12 
                  }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation Skeleton */}
      <View style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={{ 
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 6
          }}>
            <PlaceholderBox style={{ 
              width: 24, 
              height: 24, 
              marginBottom: 4 
            }} />
            <PlaceholderBox style={{ 
              width: 40, 
              height: 12 
            }} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TripSkeletonCustom;