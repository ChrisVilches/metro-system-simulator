import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './normalize.css';
import './skeleton.css';
import "font-awesome/css/font-awesome.min.css";
import './index.scss';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
