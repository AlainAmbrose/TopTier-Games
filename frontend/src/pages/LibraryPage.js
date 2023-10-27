import React, { useState } from "react";

const LibraryPage = () => {
  var currentUser = localStorage.getItem("user");

  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [message, setMessage] = useState("");

  const renderLibraryInfo = async () => {
    try {
      const response = await fetch(
        "https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/getuser",
        {
          method: "POST",
          body: currentUser,
          headers: { "Content-Type": "application/json" },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("User not found");
      } else {
        var user = {
          firstName: res.firstname,
          lastName: res.lastname,
          id: res.id,
        };
        setFn(user.firstName);
        setLn(user.lastName);
        setMessage("");
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  return (
    <div id="LibraryDiv">
      <button
        type="button"
        id="addCardButton"
        className="buttons"
        onClick={renderLibraryInfo}
      >
        {" "}
        Show User Data{" "}
      </button>
      <p>{fn}</p>
      <br></br>
      <p>{ln}</p>
    </div>
  );
};

export default LibraryPage;
