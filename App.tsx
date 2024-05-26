import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar';
import {Text, TextInput, View} from 'react-native';
import AuthProvider from "@/providers/AuthProvider";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Navigation from "@/navigation/Navigation";
import {useEffect} from "react";
import {initDB} from "./database/database";

const queryClient = new QueryClient()

export default function App() {
    useEffect(() => {
        initDB()
    }, []);

    return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <SafeAreaProvider>
                  <Navigation/>
                  {/*<Text>asdsadsa</Text>*/}
              </SafeAreaProvider>
          </AuthProvider>
          <StatusBar style="dark"/>
      </QueryClientProvider>
    );
}