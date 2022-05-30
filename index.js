/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider,DefaultTheme, DarkTheme} from 'react-native-paper';
import * as React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {rootReducer} from './redux/Index';


const store = createStore(rootReducer);

export default function Main() {
  return (
    <>
      <Provider store={store}>
        <PaperProvider   >
          <App />
        </PaperProvider>
      </Provider>
    </>
  );
}

AppRegistry.registerComponent(appName, () => Main);
