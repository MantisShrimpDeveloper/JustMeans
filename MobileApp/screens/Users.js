import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

Tab = createBottomTabNavigator();

export default function Users() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name='Trusted' component={Trusted}/>
                <Tab.Screen name='All' component={All}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}