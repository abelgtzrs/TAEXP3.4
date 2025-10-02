import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";
import DashboardScreen from "../screens/DashboardScreen";
import CollectionsScreen from "../screens/CollectionsScreen";
import FinanceScreen from "../screens/FinanceScreen";
import MoreScreen from "../screens/MoreScreen";
import LoginScreen from "../screens/LoginScreen";
import VolumeListScreen from "../screens/VolumeListScreen";
import VolumeDetailScreen from "../screens/VolumeDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Collections" component={CollectionsScreen} />
    <Tab.Screen name="Finance" component={FinanceScreen} />
    <Tab.Screen name="More" component={MoreScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // could be a splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="VolumeList" component={VolumeListScreen} />
            <Stack.Screen name="VolumeDetail" component={VolumeDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
