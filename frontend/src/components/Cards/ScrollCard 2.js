import { Fragment, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ScrollCard = ({ game, skeleton}) => {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);

  // console.log("Game:", game);

  const cardClasses = classNames(`group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-black transform transition-transform duration-300
  ease-in-out group hover:scale-105  hover:shadow-md  hover:shadow-gray-950`)

  
  return (
    <>
      {/* Button */}
      {!skeleton ? (<>
        <div className={cardClasses}>
          <img src={game.url} alt="" className="pointer-events-none object-cover group-hover:opacity-90" />
          <button type="button" className="absolute inset-0 focus:outline-none" onClick={() => {setOpen(true)}}>
            <span className="sr-only">View details for {game.name}</span>
          </button>
        </div>
        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-300">
          {game.name}
        </p>
        <p className="pointer-events-none block text-sm font-medium text-gray-500">
          {game.id}
        </p>
        </>) : 
      (<>
        <div className={cardClasses}>
          <SkeletonTheme baseColor="black" borderRadius="0.5rem" highlightColor="#202020">
            <Skeleton className="pointer-events-none object-cover aspect-h-7 aspect-w-10 group-hover:opacity-90"></Skeleton>
          </SkeletonTheme>
        </div>
        <p className="pointer-events-none w-8/12 mt-2 block truncate ">
          <SkeletonTheme baseColor="black" highlightColor="#202020">
            <Skeleton  count={2} ></Skeleton>
          </SkeletonTheme>
        </p>
      </>)}

      {/* POP UP */}

      {
        !skeleton && 
        (<Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                    <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                      <div className="relative flex w-full items-center overflow-hidden bg-black rounded-2xl px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                        <button
                          type="button"
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                          <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                            <img
                              src={game.url}
                              alt={product.imageAlt}
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="sm:col-span-8 lg:col-span-7">
                            <h2 className="text-2xl font-bold text-gray-200 sm:pr-12">
                              {game.name}
                            </h2>

                            <section
                              aria-labelledby="information-heading"
                              className="mt-2"
                            >
                              <h3 id="information-heading" className="sr-only">
                                Product information
                              </h3>

                              <p className="text-2xl text-gray-200">
                                {product.price}
                              </p>

                              {/* Reviews */}
                              <div className="mt-6">
                                <h4 className="sr-only">Reviews</h4>
                                <div className="flex items-center">
                                  <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                      <StarIcon
                                        key={rating}
                                        className={classNames(
                                          product.rating > rating
                                            ? "text-gray-200"
                                            : "text-gray-600",
                                          "h-5 w-5 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <p className="sr-only">
                                    {product.rating} out of 5 stars
                                  </p>
                                  <a
                                    href="#"
                                    className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    {product.reviewCount} reviews
                                  </a>
                                </div>
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
                                {/* Colors */}
                                {/* <div>
                                  <h4 className="text-sm font-medium text-gray-900">Color</h4>

                                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                    <span className="flex items-center space-x-3">
                                      {product.colors.map((color) => (
                                        <RadioGroup.Option
                                          key={color.name}
                                          value={color}
                                          className={({ active, checked }) =>
                                            classNames(
                                              color.selectedClass,
                                              active && checked ? 'ring ring-offset-1' : '',
                                              !active && checked ? 'ring-2' : '',
                                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                            )
                                          }
                                        >
                                          <RadioGroup.Label as="span" className="sr-only">
                                            {color.name}
                                          </RadioGroup.Label>
                                          <span
                                            aria-hidden="true"
                                            className={classNames(
                                              color.class,
                                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                                            )}
                                          />
                                        </RadioGroup.Option>
                                      ))}
                                    </span>
                                  </RadioGroup>
                                </div> */}

                                {/* Sizes */}
                                {/* <div className="mt-10">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900">Size</h4>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                      Size guide
                                    </a>
                                  </div>

                                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                    <div className="grid grid-cols-4 gap-4">
                                      {product.sizes.map((size) => (
                                        <RadioGroup.Option
                                          key={size.name}
                                          value={size}
                                          disabled={!size.inStock}
                                          className={({ active }) =>
                                            classNames(
                                              size.inStock
                                                ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                              active ? 'ring-2 ring-indigo-500' : '',
                                              'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                            )
                                          }
                                        >
                                          {({ active, checked }) => (
                                            <>
                                              <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                                              {size.inStock ? (
                                                <span
                                                  className={classNames(
                                                    active ? 'border' : 'border-2',
                                                    checked ? 'border-indigo-500' : 'border-transparent',
                                                    'pointer-events-none absolute -inset-px rounded-md'
                                                  )}
                                                  aria-hidden="true"
                                                />
                                              ) : (
                                                <span
                                                  aria-hidden="true"
                                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                >
                                                  <svg
                                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                    viewBox="0 0 100 100"
                                                    preserveAspectRatio="none"
                                                    stroke="currentColor"
                                                  >
                                                    <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                  </svg>
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </RadioGroup.Option>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                </div> */}

                                <button
                                  type="submit"
                                  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-800 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                  Add to library
                                </button>
                              </form>
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
  );
};


ScrollCard.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  skeleton: PropTypes.bool.isRequired, 
};

// If you want to specify default values for your props, you can do so as follows:
ScrollCard.defaultProps = {
  game: {
    name: "loading",
    id: -1,
    url: "/#"
  },
  skeleton: false,
};

export default ScrollCard;
