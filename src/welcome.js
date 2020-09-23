import React from "react";
// import Name from "./name";
import { HashRouter, Route } from "react-router-dom";
import { link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

//export default does not curlies on import side. export does not.
//function component
export default function Welcome() {
    // const cuteAnimal = "moose";

    return (
        <div>
            <h1 className="title">Welcome to muSEEQ</h1>
            {/* <Name cuteAnimal={cuteAnimal} /> */}
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}
