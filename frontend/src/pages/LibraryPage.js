import React, { useState, useEffect } from "react";
import LibraryContent from "../components/LibraryContent";

const LibraryPage = () => {
  var currentUser = localStorage.getItem("user_data");

  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [message, setMessage] = useState("");

  const app_name = "poosd-large-project-group-8-1502fa002270";
  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://" + app_name + ".herokuapp.com/" + route;
    } else {
      return "http://localhost:5001/" + route;
    }
  }

  const renderLibraryInfo = async () => {
    try {
      const response = await fetch(buildPath("Users/api/getuser"), {
        method: "POST",
        body: currentUser,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("User not found");
      } else {
        var user = {
          firstName: res.firstname,
          lastName: res.lastname,
          id: res.id,
        };
        localStorage.setItem("userInfo", user);
        setFn(user.firstName);
        setLn(user.lastName);
        setMessage("");
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  useEffect(() => {
    renderLibraryInfo();
  }, []);

  const [isClicked1, setIsClicked1] = useState(true);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [selectedTab, setTab] = useState("played");

  const toggleColor1 = () => {
    setIsClicked1(!isClicked1);
    setTab("played");
    if (isClicked2) {
      setIsClicked2(!isClicked2);
    }
    if (isClicked3) {
      setIsClicked3(!isClicked3);
    }
  };

  const toggleColor2 = () => {
    setIsClicked2(!isClicked2);
    setTab("wantToPlay");
    if (isClicked1) {
      setIsClicked1(!isClicked1);
    }
    if (isClicked3) {
      setIsClicked3(!isClicked3);
    }
  };

  const toggleColor3 = () => {
    setIsClicked3(!isClicked3);
    setTab("all");
    if (isClicked1) {
      setIsClicked1(!isClicked1);
    }
    if (isClicked2) {
      setIsClicked2(!isClicked2);
    }
  };

  return (
    <div id="LibraryDiv">
      <div className="h-[40px] w-[40px] rounded-full bg-slate-800 left-[160vh] top-[3vh] absolute"></div>
      <div className="text-slate-50 italic font-bold text-[5vh] left-[5vh] top-[2vh] absolute ">
        TopTier
      </div>
      <div className="text-slate-50 left-[139vh] top-[3.7vh] absolute ">
        Welcome, {fn} {ln}
      </div>
      <button
        className={`${
          isClicked1 ? "bg-slate-800" : "bg-opacity-50"
        } text-slate-50 top-[7.8rem] left-[41px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor1}
      >
        Played
      </button>
      <button
        className={`${
          isClicked2 ? "bg-slate-800" : "bg-opacity-50"
        } text-slate-50 top-[7.8rem] left-[191px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor2}
      >
        Want to Play
      </button>
      <button
        className={`${
          isClicked3 ? "bg-slate-800" : "bg-opacity-50"
        } text-slate-50 top-[7.8rem] left-[341px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor3}
      >
        All
      </button>
      <LibraryContent selectedTab={selectedTab} />
    </div>
  );
};

export default LibraryPage;
