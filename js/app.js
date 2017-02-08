import 'babel-polyfill';

import AppChat from './components/AppChat';
import AppChatRoute from './routes/AppChatRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blue200 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('../styles/main.styl');

ReactDOM.render(
    <Relay.Renderer
        environment={Relay.Store}
        Container={AppChat}
        queryConfig={new AppChatRoute()}
    />,
    document.getElementById('s-app')
);
