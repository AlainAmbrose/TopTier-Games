import React from 'react'
import PropTypes from "prop-types";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import HorizontalGameList from "./Lists/HorizontalGameList";
import LongText from "./LongText";
import { Rating } from 'react-simple-star-rating'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { AuthContext } from "./Authorizations/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkUserGames, addUserGame, deleteUserGame, product, convertDate, fillColorArray } from "../utils/cardpopupUtils";
import ReviewPopup from "./ReviewPopup";
import ProgressDropDown from './ProgressDropDown';
import UserStatistics from './UserStats';
const mongoose = require("mongoose");


const writeReview = (event, foundGameFlag, showSuperToast, setIsReviewing) => { 
  event.preventDefault();
  if (!foundGameFlag) {
    showSuperToast("Game must be in your library to write a review", "game-not-in-library");
    return;
  }

  setIsReviewing(true);
}

const CardPopup = ({ game, gameInfo, isLoadingGameInfo, open, setOpen, skeleton }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  if (localStorage.getItem("user_data") !== null) {
    var currentUser = localStorage.getItem("user_data");
    var userData = JSON.parse(currentUser);
    var userId = new mongoose.Types.ObjectId(userData.id);
  }

  const authContext = useContext(AuthContext);
  const { user, userSignup, userLogin, userLogout, showSuperToast } = authContext;
  const navigate = useNavigate();

  // if (user !== null) {
  //     var userId = new mongoose.Types.ObjectId(user.id);
  // }

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);

  const { data: userGame, isLoading: isLoadingUserGame, isError, error, refetch} = useQuery(
    [userId, gameInfo], () => checkUserGames(userId, gameInfo._id),
    {
      enabled: !!userId && !! gameInfo,
    }
  );

  return (
    <>
      {!skeleton && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-40" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 hidden bg-gray-800 bg-opacity-75 transition-opacity md:block" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                  enterTo="opacity-100 translate-y-0 md:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 md:scale-100"
                  leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                >
                  <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-6xl">
                    <div className="relative flex w-full h-fit items-center overflow-hidden bg-black rounded-2xl px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 ">
                      <button
                        type="button"
                        className="absolute right-4 top-4 text-gray-400 z-40 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 ">
                        <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                          <img
                            src={game.url}
                            alt={product.imageAlt}
                            className="object-cover object-center"
                          />
                        </div>
                        <div className="sm:col-span-8 lg:col-span-7 relative scrollable-div overflow-auto lg:h-[620px] md:h-[270px] mr-10">
                          <h2 className="text-4xl font-bold text-gray-200 sm:pr-12">
                            {game.name}
                          </h2>
                          {/* START HERE  */}
                          <section
                            aria-labelledby="information-heading"
                            className="mt-2"
                          >
                            <h3 id="information-heading" className="sr-only">
                              Game information
                            </h3>
                            {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.releasedate !== undefined) ?
                              (<p className="text-2xl text-gray-200">
                                <span className="text-2xl text-blue-600">Release Date: </span> {convertDate(gameInfo.releasedate)}
                              </p>) :
                              (<>
                                <p className="pointer-events-none w-4/12 h-5 mt-2 block truncate ">
                                  <SkeletonTheme baseColor="black" highlightColor="#202020">
                                    <Skeleton count={1} ></Skeleton>
                                  </SkeletonTheme>
                                </p>
                              </>)
                            }


                            {/* Reviews */}
                            <div className="mt-6">
                              <h4 className="sr-only">Reviews</h4>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.gameranking !== undefined) ?
                                    (
                                      <Rating
                                        size={25}
                                        transition
                                        initialValue={gameInfo.gameranking.$numberDecimal}
                                        allowFraction
                                        fillColorArray={fillColorArray}
                                        emptyColor="black"
                                        SVGstyle={{ 'display': "inline" }}
                                        readonly={true}
                                      />) :
                                    (<>
                                      <Rating
                                        size={25}
                                        transition
                                        initialValue={0}
                                        allowFraction
                                        fillColorArray={fillColorArray}
                                        emptyColor="gray"
                                        SVGstyle={{ 'display': "inline" }}
                                        readonly={true}
                                      />
                                    </>)
                                  }


                                </div>
                                  {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.gameranking !== undefined) && ( <p className="sr-only"> {gameInfo.gameranking.$numberDecimal} out of 5 stars </p>)}
                                  {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.reviewcount) ? (<p className="ml-3 text-sm font-medium text-blue-600 "> {gameInfo.reviewcount} ratings </p>)
                                    : (
                                      <p className="pl-[2rem] pointer-events-none w-[8rem] mt-2 block truncate ">
                                      <SkeletonTheme baseColor="black" highlightColor="#202020">
                                        <Skeleton count={1} className='h-[1.2rem]'></Skeleton>
                                      </SkeletonTheme>
                                      </p>
                                      )
                                  }
                                  <div>
                                    {(isLoadingGameInfo || userGame === undefined) ? 
                                      (
                                        <>
                                        <SkeletonTheme baseColor="black" highlightColor="#202020"  width={"12rem"}>
                                          <Skeleton count={1} className="mt-0 flex items-center h-8 w-full justify-center rounded-md border border-transparent bg-gray-500 px-0 py-3 text-base font-medium text-white "></Skeleton>
                                        </SkeletonTheme>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            type="submit"
                                            className="mt-0 ml-[1.5rem] h-8 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-700 px-8 py-3 text-base font-medium text-white cursor-pointer hover:bg-blue-800 "
                                              onClick={(event) => writeReview(event, userGame.foundGameFlag, showSuperToast, setIsReviewing)}
                                          >
                                            Write a Review 
                                          </div>
                                        </>
                                      )
                                    }
                                  </div>
                              </div>
                              {<ReviewPopup game={game} gameInfo={gameInfo} isReviewing={isReviewing} setIsReviewing={setIsReviewing} skeleton={skeleton}></ReviewPopup>}
                            </div>
                            {/* Progress */}

                            {(userGame !== undefined) && (
                              <div className="mt-6">
                                <ProgressDropDown userGame={userGame} refetchFocusedUserGameData={refetch}></ProgressDropDown>
                              </div>
                            )}
                          

                            {/* Description */}
                            <div className="mt-6">
                              <h4 className="sr-only">Game Description</h4>

                              {/* <p className="text-base text-gray-200"> */}
                              {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.storyline !== undefined) && <LongText content={gameInfo.storyline} limit={150}></LongText>}
                              {/* </p> */}
                            </div>
                          </section>

                          <section
                            aria-labelledby="options-heading"
                            className="mt-10"
                          >
                            <h3
                              id="options-heading"
                              className="sr-only"
                            >
                              Product options
                            </h3>

                            <form>
                              {(isLoadingGameInfo || userGame === undefined) ? 
                                (
                                  <>
                                  <SkeletonTheme baseColor="black" highlightColor="#202020" >
                                    <Skeleton count={1} className="mt-6 flex w-full items-center h-[48px] justify-center rounded-md border border-transparent bg-gray-500 px-8 py-3 text-base font-medium text-white "></Skeleton>
                                  </SkeletonTheme>
                                  </>
                                ) : (
                                  (userGame.foundGameFlag) ? (
                                    <>
                                      <button type="submit" className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 "
                                        onClick={(event) => {
                                          deleteUserGame(event, userId, gameInfo._id, refetch, window.location.pathname)
                                          showSuperToast("Game removed from library", "game-removed-from-library");
                                        }}
                                      >
                                        Remove from library 
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="submit"
                                        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 "
                                        onClick={(event) => {
                                          addUserGame(event, userId, gameInfo._id, refetch, window.location.pathname);
                                          showSuperToast("Game added to library", "game-added-to-library");
                                        }}
                                      >
                                        Add to library 
                                      </button>
                                    </>
                                  )
                                )
                              }
                            </form>
                          </section>

                          {/* Recommended Section */}

                          <section
                            aria-labelledby="options-heading"
                            className="mt-10 "
                          >
                            <h3 id="options-heading" className="sr-only">
                              Statistics
                            </h3>
                            <UserStatistics></UserStatistics>

                          </section>

                          <section
                            aria-labelledby="options-heading"
                            className="mt-10 "
                          >
                            <h3 id="options-heading" className="sr-only">
                              Similar Games
                            </h3>

                            <div >
                              <h4 className="text-sm font-medium text-3xl text-gray-300">Similar Games</h4>
                              {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.similargames !== undefined) ?
                                <HorizontalGameList games={gameInfo.similargames} ></HorizontalGameList> :
                                <HorizontalGameList skeleton={true} skeletoncount={10} ></HorizontalGameList>
                              }
                              {/* <HorizontalGameList skeleton={true} skeletoncount={10} ></HorizontalGameList> */}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};

CardPopup.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  gameInfo: PropTypes.object, // This allows both object and undefined
  isLoadingGameInfo: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  skeleton: PropTypes.bool.isRequired,
};

CardPopup.defaultProps = {
  game: {
    name: "loading",
    id: -1,
    url: "/#"
  },
  isLoadingGameInfo: true,
  setOpen: () => { },
  skeleton: true,
};


export default CardPopup
