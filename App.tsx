import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar';
import {Text, TextInput, View} from 'react-native';
import AuthProvider from "@/providers/AuthProvider";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Navigation from "@/navigation/Navigation";

const queryClient = new QueryClient()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <SafeAreaProvider>
                  <Navigation/>
              </SafeAreaProvider>
          </AuthProvider>
          <StatusBar style="dark"/>
      </QueryClientProvider>
  );
}