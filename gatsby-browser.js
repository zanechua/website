import useStore from 'lib/zustand';

import 'styles/style.css';
import 'styles/markdown.css';
import 'styles/prism.css';
import 'styles/prism-vsc-dark-plus.css';
import 'styles/prism-language-tabs.css';
import 'styles/cat.css';

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
