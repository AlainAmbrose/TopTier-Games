import React from 'react'
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Rating } from 'react-simple-star-rating'
import HorizontalGameList from './Lists/HorizontalGameList';
import LongText from './LongText';

const product = {
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

const fillColorArray = [
  "#f17a45",
  "#f17a45",
  "#f19745",
  "#f19745",
  "#f1a545",
  "#f1a545",
  "#f1b345",
  "#f1b345",
  "#f1d045",
  "#f1d045"
];

const convertDate = (date) => {
  // Assuming releaseDate is in seconds. If it's in milliseconds, you don't need to multiply by 1000.
  const releaseDate = new Date(date * 1000);

  // Options for formatting the date
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  // Format the date
  const formattedDate = releaseDate.toLocaleDateString('en-US', options);

  return formattedDate;
}
  

const CardPopup = ({ 
  game,
  gameInfo,
  isLoadingGameInfo,
  open, 
  setOpen,
  skeleton 
  }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);


  return (
    <>
      {!skeleton && 
        (<Transition.Root show={open} as={Fragment}>
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
                        <div  className="sm:col-span-8 lg:col-span-7 relative scrollable-div overflow-auto lg:h-[620px] md:h-[270px] mr-10">
        
                          <h2 className="text-4xl font-bold text-gray-200 sm:pr-12">
                            {game.name}
                          </h2>

                          <section
                            aria-labelledby="information-heading"
                            className="mt-2"
                          >
                            <h3 id="information-heading" className="sr-only">
                              Game information
                            </h3>
                            {(!isLoadingGameInfo && gameInfo !== undefined) && 
                              <p className="text-2xl text-gray-200">
                                <span className="text-2xl text-blue-600">Release Date: </span> {convertDate(gameInfo.releaseDate)}
                              </p>
                            }
                            

                            {/* Reviews */}
                            <div className="mt-6">
                              <h4 className="sr-only">Reviews</h4>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  { (!isLoadingGameInfo && gameInfo !== undefined) &&                
                                    <Rating
                                    size={25}
                                    transition
                                    initialValue={gameInfo.rating}
                                    allowFraction
                                    fillColorArray={fillColorArray}
                                    emptyColor="black"
                                    SVGstyle={ {'display' : "inline"}}
                                    readonly={true}
                                  /> }
                              
                                
                                </div>
                                {(!isLoadingGameInfo && gameInfo !== undefined) && 
                                (<>
                                  <p className="sr-only">
                                    {gameInfo.rating} out of 5 stars
                                  </p>
                                  <a
                                    href="#"
                                    className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    {/*  */}
                                    {product.reviewCount} ratings 
                                  </a>
                                </>)}
                              </div>
                            </div>


                            {/* Description */}
                            <div className="mt-6">
                              <h4 className="sr-only">Game Description</h4>

                              {/* <p className="text-base text-gray-200"> */}
                                {(!isLoadingGameInfo && gameInfo !== undefined && gameInfo.summary !== undefined) && <LongText content={gameInfo.summary} limit={150}></LongText> }
                              {/* </p> */}
                            </div>
                          </section>

                          <section
                            aria-labelledby="options-heading"
                            className="mt-10"
                          >
                            <h3 id="options-heading" className="sr-only">
                              Product options
                            </h3>

                            <form>
                              <button
                                type="submit"
                                className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-800 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Add to library
                              </button>
                            </form>
                          </section>

                          {/* Recommended Section */}

                          <section
                            aria-labelledby="options-heading"
                            className="mt-10 "
                          >
                            <h3 id="options-heading" className="sr-only">
                              Similar Games
                            </h3>

                              <div >
                                <h4 className="text-sm font-medium text-3xl text-gray-300">Similar Games</h4>
                                {/* {  (!isLoadingGameInfo || gameInfo !== undefined) ? 
                                  <HorizontalGameList games={gameInfo.similarGames} ></HorizontalGameList> :
                                  <HorizontalGameList skeleton={true} skeletoncount={10} ></HorizontalGameList> 
                                } */}
                                <HorizontalGameList skeleton={true} skeletoncount={10} ></HorizontalGameList>
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
        </Transition.Root>)
      }
    </>
  )
}

export default CardPopup