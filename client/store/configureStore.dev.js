import { createStore, applyMiddleware, compose } from 'redux';
import api from 'middleware/api';
import createLogger from 'redux-logger';
import rootReducer from 'reducers';
import DevTools from 'containers/DevTools';

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(api, createLogger()),
            DevTools.instrument()
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
