import React from "react";
import GridList from "./Lists/GridList";

function LibraryContent({ selectedTab }) {
  // Defines different content for each tab
  const tabContent = {
    played: (
      <div className="h-[100vh] bg-slate-800 mt-[10rem] m-[25px] rounded-md">
        <h2 className="text-gray-300">Game List for 'Played' tab</h2>
      </div>
    ),
    wantToPlay: (
      <div className="h-[100vh] bg-slate-800 mt-[10rem] m-[25px] rounded-md">
        <h2 className="text-gray-300">Game List for 'Want to Play' tab</h2>
      </div>
    ),
    all: (
      <div className="h-[100vh] bg-slate-800 mt-[10rem] m-[25px] rounded-md">
        <h2 className="text-gray-300">Game List for 'all' tab</h2>
      </div>
    ),
  };

  return <div className="p-4">{tabContent[selectedTab]}</div>;
}

export default LibraryContent;
