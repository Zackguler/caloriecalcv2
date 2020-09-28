import React from 'react';
import { View, Text } from 'react-native';
import Save from './components/Save';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calculate from "./components/Calculate";

function SaveScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Save />
    </View>
  );
}

function CalculateScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Calculate/>
    </View>
  );
}
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return(

        <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Save" component={SaveScreen} />
        <Tab.Screen name="Calculate" component={CalculateScreen} />
      </Tab.Navigator>
    </NavigationContainer>


    );
  }
}
