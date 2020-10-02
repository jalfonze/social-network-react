import React, { useState, useEffect } from "react";
import Axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [person, findPerson] = useState();
    const [results, setResults] = useState();
    const [noMatch, setNoMatch] = useState(false);

    useEffect(() => {
        // console.log("USEREFFECT");
        if (!person) {
            findPerson(undefined);
        }
        console.log("INPUT VALUE", person);
        if (person == "") {
            return;
        } else {
            (async () => {
                try {
                    const { data } = await Axios.get(
                        "/users/" + person + ".json"
                    );
                    setResults(data);
                    console.log("DATA FROM SEARCH", data);
                    if (data.length == 0) {
                        setNoMatch(true);
                        console.log("NODATA");
                    } else {
                        setNoMatch(false);
                    }
                } catch (err) {
                    console.log("ERROR IN USE EFECT", err);
                }
            })();
        }
    }, [person]);

    const handleChange = (e) => {
        // console.log(e.target.value);
        findPerson(e.target.value);
    };

    return (
        console.log("SEARCH RESULTS", results),
        (
            // console.log(Array.isArray(results)),
            <div>
                <div className="search-bar">
                    <h1>Search</h1>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="person"
                        placeholder="Search user"
                    />
                    <h1>Our most recent signers</h1>
                    {noMatch && <h2>No matches</h2>}
                </div>
                <div className="other-user-body">
                    {(!results && <h1>Loading...</h1>) ||
                        (results &&
                            results.map((user, i) => {
                                return (
                                    <div className="other-users" key={i}>
                                        <div className="imageBoxSmall">
                                            <Link to={"/user/" + user.id}>
                                                <img
                                                    width="100px"
                                                    key={user.id}
                                                    src={
                                                        user.img_url ||
                                                        "/default-photo.jpg"
                                                    }
                                                ></img>
                                            </Link>
                                        </div>
                                        <div>
                                            <h3 key={i}>
                                                <Link to={"/user/" + user.id}>
                                                    {user.first_name}{" "}
                                                    {user.last_name}
                                                </Link>
                                            </h3>
                                            {/* <p>{user.bio}</p>
                                        {!user.bio && <p>No Bio</p>} */}
                                        </div>
                                    </div>
                                );
                            }))}
                </div>
            </div>
        )
    );
}
