import React, { useState, useEffect } from "react";
import Axios from "./axios";

export default function FindPeople() {
    const [person, findPerson] = useState();
    const [results, setResults] = useState();

    useEffect(() => {
        // console.log("USEREFFECT");
        if (!person) {
            findPerson(undefined);
        }
        console.log("INPUT VALUE", person);
        if (person == "") {
            return;
        } else {
            Axios.get("/users/" + person + ".json")
                .then((response) => {
                    // console.log("FIRST MOUNT RESPONSE", response.data);
                    setResults(response.data);
                })
                .catch((err) => console.log("ERRORI IN SEARCH USERS", err));
        }
        // (async () => {
        //     try {
        //         const { data } = await Axios.get("/users/" + person + ".json");
        //         setResults(data);
        //         // console.log("DATA FROM SEARCH", data);
        //     } catch (err) {
        //         console.log("ERROR IN USE EFECT", err);
        //     }
        // })();
    }, [person]);

    const handleChange = (e) => {
        // console.log(e.target.value);
        findPerson(e.target.value);
    };

    return (
        // console.log("SEARCH RESULTS", results),
        // console.log(Array.isArray(results)),
        <div>
            <h1>Search</h1>
            <input
                onChange={handleChange}
                type="text"
                name="person"
                placeholder="Search user"
            />
            <h1>Our most recent signers</h1>
            {/* {!results && <h1>Loading...</h1>} */}
            {(!results && <h1>Loading...</h1>) ||
                (results &&
                    results.map((user, i) => {
                        return (
                            <div className="other-users" key={i}>
                                <img
                                    height="100px"
                                    key={i}
                                    src={user.img_url}
                                ></img>
                                <div>
                                    <h2 key={i}>
                                        {user.first_name} {user.last_name}
                                    </h2>
                                    <p>{user.bio}</p>
                                </div>
                            </div>
                        );
                    }))}
        </div>
    );
}
