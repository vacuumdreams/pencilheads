// import { invoke } from '@tauri-apps/api';
// import { listen } from '@tauri-apps/api/event';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/services/firebase';
// import callbackTemplate from './callback.template';
// import { googleSignIn, openGoogleSignIn } from './auth'

export const signInWithGoogle = async () => {
  if (!window.__TAURI__) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    return;
  }


  // Wait for callback from tauri oauth plugin
  // listen('oauth://url', (event) => {
  //   googleSignIn(event.payload as string);
  // });

  // // Start tauri oauth plugin. When receive first request
  // // When it starts, will return the server port
  // // it will kill the server
  // const port = await invoke('plugin:oauth|start', {
  //   config: {
  //     // Optional config, but use here to more friendly callback page
  //     response: callbackTemplate,
  //   },
  // })

  // await openGoogleSignIn(port as string);
};
