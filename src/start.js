import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import Reducer from "./reducers";

const store = createStore(
    Reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = (
        <Provider store={store}>
            <App />;
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));
