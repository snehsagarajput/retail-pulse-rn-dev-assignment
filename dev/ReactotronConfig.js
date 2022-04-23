import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  networking,
  asyncStorage,
} from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

global.RC = Reactotron; //debug mode only (useful for debugging)

let scriptHostname;
// if (window.__DEV__) {
//   const scriptURL = NativeModules.SourceCode.scriptURL;
//   scriptHostname = scriptURL.split('://')[1].split(':')[0];
// }

//run from root : `yarn reactotron` to use reactotron forn Android
//download link : https://github.com/infinitered/reactotron/releases/download/v2.17.1/Reactotron-2.17.1.dmg

Reactotron.clear();

export default reactotron = Reactotron.setAsyncStorageHandler(null) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({name: 'App'})
  .useReactNative({
    asyncStorage: true, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: {veto: () => false}, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .use(reactotronRedux())
  .use(
    trackGlobalErrors({
      veto: (frame) =>
        frame.fileName.indexOf('/node_modules/react-native/') >= 0,
    }),
  )
  .use(openInEditor())
  .use(asyncStorage())
  .use(networking())
  .connect();
