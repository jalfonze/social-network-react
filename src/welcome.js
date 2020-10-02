import React from "react";
// import Name from "./name";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-password";

//export default does not curlies on import side. export does not.
//function component
export default function Welcome() {
    // const cuteAnimal = "moose";

    return (
        <div>
            <img className="title" src="/logo3.png"></img>
            {/* <Name cuteAnimal={cuteAnimal} /> */}

            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}
