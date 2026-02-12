import React, { createContext, useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const InternetContext = createContext({
  isConnected: true,
});

type Props = {
  children: ReactNode;
};

const InternetProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        state.isConnected === true && state.isInternetReachable !== false;

      setIsConnected(connected);

      if (!connected) {
        Alert.alert('No Internet', 'Internet connection is off or slow');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <InternetContext.Provider value={{ isConnected }}>
      {children}
    </InternetContext.Provider>
  );
};

export default InternetProvider;
