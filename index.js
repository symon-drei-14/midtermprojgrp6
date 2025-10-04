/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import LocationService from './src/services/LocationService';

AppRegistry.registerComponent(appName, () => App);

BackgroundFetch.registerHeadlessTask(async (event) => {
  const { taskId } = event;
  try {
    await LocationService.configureBackgroundFetch();
    const hasPermission = await LocationService.requestLocationPermission();
    if (hasPermission) {
      await LocationService.updateLocation();
    }
  } catch (e) {
    console.warn('Headless background fetch error', e);
  } finally {
    BackgroundFetch.finish(taskId);
  }
});
