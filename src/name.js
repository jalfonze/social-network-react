import React from "react";
import axios from "axios";

export default class Name extends React.Component {
    constructor(props) {
        super(props);
        //class can use 'state' which is react from data
        //states only live in class components
        this.state = {
            name: "justin",
        };
        // ES5 version how to bind this to event handler without arrow function
        // this.handleClick = this.handleClick.bind(this);
    }

    //mounted
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                name: "JUSTIN YOU BLOODY GUY",
                age: 20,
            });
        }, 2000);
    }

    handleClick() {
        console.log("HEY");
        // axios.get("/send").then((response) => {});
        this.setState({
            name: "jayboy",
        });
    }

    render() {
        return (
            <div>
                {/* must bind this with event */}
                <h1 onClick={() => this.handleClick()}>
                    hey {this.state.name}
                </h1>
                <p> YOU ARE BLOODY {this.state.age}</p>
                <h3>{this.props.cuteAnimal}</h3>
            </div>
        );
    }
}
