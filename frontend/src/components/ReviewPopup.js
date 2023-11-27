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
import { buildPath } from '../utils/utils';
import { checkUserGames, addUserGame, deleteUserGame, product, convertDate, fillColorArray } from "../utils/cardpopupUtils";

const mongoose = require("mongoose");

const tooltipArray = [
    "Terrible",
    "Terrible+",
    "Bad",
    "Bad+",
    "Average",
    "Average+",
    "Great",
    "Great+",
    "Awesome",
    "Awesome+"
];


const submitReview = async (event, userId, gameId, ranking, review, showSuperToast) => {
    event.preventDefault();

    if (ranking === 0 || review === "") {
        showSuperToast("Please fill out all fields", "user-gave-bad-rating");
        return;
    } else {
        showSuperToast("Review Added!", "user-gave-good-rating");
    }

    const objRating = { 
        userId: userId,
        gameId: gameId,
        ranking: ranking,
    }

    let js = JSON.stringify(objRating);
    console.log("Submit Rating Request", js);

    try {
        const response = await fetch(buildPath('Ranking/api/setranking'), {
            method: "POST",
            body: js,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
            console.error(`Error thrown when submitting review: ${jsonResponse.message}`);
        }


    } catch (e) {
        console.error(`Error thrown when submitting review: ${e}`);
        throw new Error(`HTTP error! status: ${e}`);
    }

    const objReview = { 
        userId: userId,
        gameId: gameId,
        review: review,
    }

    js = JSON.stringify(objReview);
    console.log("Submit Review Request", js);

    try {
        const response = await fetch(buildPath('Ranking/api/setreview'), {
            method: "POST",
            body: js,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        const jsonResponse = await response.json();

        if (!response.ok) {
            console.error(`Error thrown when submitting review: ${jsonResponse.message}`);
        }
        
    } catch (e) {
        console.error(`Error thrown when submitting review ${e}`);
        throw new Error(`HTTP error! status: ${e}`);
    }
}


const ReviewPopup = ({ game, gameInfo, isReviewing, setIsReviewing, skeleton }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  if (localStorage.getItem("user_data") !== null) {
    var currentUser = localStorage.getItem("user_data");
    var userData = JSON.parse(currentUser);
    var userId = new mongoose.Types.ObjectId(userData.id);
  }

  const authContext = useContext(AuthContext);
  const { user, userSignup, userLogin, userLogout, showSuperToast } = authContext;
  const navigate = useNavigate();

  const handleRating = (rate) => setRating(rate);

  return (
    <>
      {!skeleton && (
        <Transition.Root show={isReviewing} as={Fragment}>
          <Dialog as="div" className="relative z-40 " onClose={setIsReviewing}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 hidden bg-gray-800 bg-opacity-50 transition-opacity md:block" />
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
                    <div className="relative flex w-3/4 my-[5rem] mx-auto items-center overflow-hidden bg-black rounded-2xl px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 ">
                      <button
                        type="button"
                        className="absolute right-4 top-4 text-gray-400 z-40 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                        onClick={() => setIsReviewing(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 ">
                        <div className="sm:col-span-8 lg:col-span-full relative scrollable-div overflow-auto lg:h-[620px] md:h-[270px] mr-10">
                          <h2 className="text-4xl font-bold text-gray-200 sm:pr-12">
                            <span className='text-blue-600'>Reviewing:</span>  {game.name}
                          </h2>
                          {/* START HERE  */}
                          <section
                            aria-labelledby="information-heading"
                            className="mt-2"
                          >
                            <h3 id="information-heading" className="sr-only">
                              Review Game
                            </h3>

                            {/* Reviewing */}
                            <div className="mt-6">
                              <h4 className="sr-only">Reviews</h4>
                              <div className="flex items-center">
                                {/* <div className="flex items-center">
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
                                </div> */}
                                <p className="sr-only"> out of 5 stars </p>
                              </div>
                            </div>
                            <div className="border-b border-white/10 pb-12">
                                <p className="mt-1 text-sm leading-6 text-gray-400">
                                    This information will be displayed only for you.
                                </p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="username" className="block text-sm font-medium  leading-6 text-white">
                                            Rating
                                        </label>
                                        <div className="mt-2">
                                            <Rating
                                                onClick={handleRating}
                                                size={35}
                                                transition
                                                allowFraction
                                                showTooltip
                                                tooltipArray={tooltipArray}
                                                SVGstyle={{ 'display': "inline" }}
                                                fillColorArray={fillColorArray}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                                            Review
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                            id="about"
                                            name="about"
                                            rows={3}
                                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about this game.</p>
                                    </div>
                        
                                </div>
                                <button
                                    type="submit"
                                    className="mt-12 flex w-2/3 mx-auto items-center justify-center rounded-md border border-transparent bg-blue-700 px-8 py-3 text-base font-medium text-white hover:bg-blue-800 "
                                    onClick={(event) => submitReview(event, userId, gameInfo._id, rating, review, showSuperToast)}
                                    >
                                    Submit 
                                </button>
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

ReviewPopup.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  gameInfo: PropTypes.object, // This allows both object and undefined
  isReviewing: PropTypes.bool.isRequired,
  setIsReviewing: PropTypes.func.isRequired,
  skeleton: PropTypes.bool.isRequired,
};

ReviewPopup.defaultProps = {
  game: {
    name: "loading",
    id: -1,
    url: "/#"
  },
  setIsReviewing: () => { },
  skeleton: true,
};


export default ReviewPopup
