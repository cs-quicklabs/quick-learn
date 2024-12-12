'use client';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { store, persistor } from './store';

export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * Added Redux to forefully work on client side only using persistor
   * will create issue while comparing data from backend and current stored data
   */

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate loading={<FullPageLoader />} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
};
