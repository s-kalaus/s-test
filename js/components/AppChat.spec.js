/* global expect */

import React from 'react';
import Relay from 'react-relay';
import AppChat from './AppChat';
import AppChatRoute from '../routes/AppChatRoute';
import renderer from 'react-test-renderer';

test('No tests specified', () => {

    const component = renderer.create(
        <Relay.Renderer
            environment={Relay.Store}
            Container={AppChat}
            queryConfig={new AppChatRoute()}
        />
    );

    expect(component).toBeDefined();
});