import React, { useState, useEffect } from "react";

const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route)
{
  if (process.env.NODE_ENV === 'production')
  {
    return 'https://' + app_name + '.herokuapp.com/' + route;
  } else
  {
    return 'http://localhost:3000/' + route;
  }
}

const LibraryPage = () =>
{
  var currentUser = localStorage.getItem("user");

  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [message, setMessage] = useState("");

  const renderLibraryInfo = async () =>
  {
    try
    {
      const response = await fetch(buildPath("Users/api/getuser"),
        {
          method: "POST",
          body: currentUser,
          headers: { "Content-Type": "application/json" },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.id <= 0)
      {
        setMessage("User not found");
      } else
      {
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
    } catch (e)
    {
      alert(e.toString());
      return;
    }
  };

  useEffect(() =>
  {
    renderLibraryInfo();
  }, []);

  return (
    <div id="LibraryDiv">
      <p className="text-slate-50">{fn}</p>
      <br></br>
      <p className="text-slate-50">{ln}</p>
    </div>
  );
};

export default LibraryPage;
