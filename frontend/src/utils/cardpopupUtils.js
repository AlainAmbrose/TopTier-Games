import { buildPath } from "./utils";

export const product = {
  name: "The Game Name",
  price: "$192",
  rating: 3.5,
  reviewCount: 117,
  href: "#",
  imageSrc:
    "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  imageAlt: "Two each of gray, white, and black shirts arranged on table.",
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
  ],
};

export const fillColorArray = [
  "#f17a45",
  "#f17a45",
  "#f19745",
  "#f19745",
  "#f1a545",
  "#f1a545",
  "#f1b345",
  "#f1b345",
  "#f1d045",
  "#f1d045",
];

export const convertDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  return formattedDate;
}


export const checkUserGames = async (userId, gameId) => {
  let js = JSON.stringify({ userId: userId, gameId: gameId });
  let response = await fetch(buildPath("Progress/api/checkusergame"), {
    method: "POST",
    body: js,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return false;
  }

  let res = await response.json();

  // console.log("FLAG++++", res);

  if (res.foundGameFlag === true) {
    return true;
  } else {
    return false;
  }
};

export const addUserGame = async (event, userId, gameId, refetch, pathname) => {
  if (pathname !== "/library") {
    event.preventDefault()
  }
  console.log("adding game to user====================")
  console.log("event", event);
  console.log("userId", userId);
  console.log("gameId", gameId);
  let js = JSON.stringify({ userId: userId, gameId: gameId });
  let response = await fetch(buildPath("Progress/api/addusergame"), {
    method: "POST",
    body: js,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let res = await response.json();

  refetch()
};

export const deleteUserGame = async (event, userId, gameId, refetch, pathname) => {
  if (pathname !== "/library") {
    event.preventDefault()
  }
  console.log("deleteUserGame====================")
  console.log("event", event);
  console.log("userId", userId);
  console.log("gameId", gameId);
  let js = JSON.stringify({ userId: userId, gameId: gameId });
  let response = await fetch(buildPath("Progress/api/deleteusergame"), {
    method: "POST",
    body: js,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let res = await response.json();

  refetch()
};
  