import useStore from './src/lib/zustand';

import './src/css/style.css';
import './src/css/markdown.css';
import './src/css/prism.css';
import './src/css/prism-vsc-dark-plus.css';
import './src/css/prism-language-tabs.css';
import './src/css/cat.css';

require('prismjs/plugins/line-numbers/prism-line-numbers.css');
require('prismjs/plugins/command-line/prism-command-line.css');

export const onRouteUpdate = () => {
  if ('serviceWorker' in navigator) {
    if (process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker.register('/sw.js').then(swInstance => {
        swInstance.update();
      });
    }
  } else {
    console.log('Service workers are not supported.');
  }
};

export const onServiceWorkerUpdateReady = () => {
  console.log('Service worker update is ready');
  useStore.setState({ hasSwUpdateReady: true });
  // window.location.reload(true);
};

export const onServiceWorkerUpdateFound = () => {
  console.log('Service worker update found');
};
