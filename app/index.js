import * as React from 'react';
import { StyleSheet,  View } from 'react-native';
import Navigation from './Navigation/Navigation';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import DrawerMenu from './Screens/main/DrawerMenu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App() {
  return (
    <ClerkProvider publishableKey='pk_test_aG9seS1oaXBwby04MS5jbGVyay5hY2NvdW50cy5kZXYk'>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <SignedIn>
            <DrawerMenu />
          </SignedIn>
          <SignedOut>
            <Navigation />
          </SignedOut>
        </View>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})

export default App;
