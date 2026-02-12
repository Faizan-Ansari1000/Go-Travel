import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/config/app-navigation/stack/AppNavigation';

export default function App() {
  return (
    <SafeAreaProvider>
       <AppNavigation />
    </SafeAreaProvider>
  );
}
