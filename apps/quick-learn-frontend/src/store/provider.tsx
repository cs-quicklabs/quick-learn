'use client';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react'; // or whatever loading component you use
import { FullPageLoader } from '@src/shared/components/UIElements';

export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // On server side, render without PersistGate
  if (typeof window === 'undefined') {
    return <Provider store={store}>{children}</Provider>;
  }

  // On client side, use PersistGate
  return (
    <Provider store={store}>
      <PersistGate loading={<FullPageLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
