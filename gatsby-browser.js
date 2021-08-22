import useStore from './src/lib/zustand';
import "./src/css/style.css";
import "./src/css/markdown.css";
import "./src/css/prism.css";
import "./src/css/cat.css";
require("prismjs/themes/prism-twilight.css");
require("prismjs/plugins/line-numbers/prism-line-numbers.css");
require("prismjs/plugins/command-line/prism-command-line.css");

export const onServiceWorkerUpdateReady = () => {
  useStore.setState({ hasSwUpdateReady: true })
  // window.location.reload(true);
};