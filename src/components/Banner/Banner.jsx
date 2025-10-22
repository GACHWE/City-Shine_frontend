import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { motion as Motion } from "framer-motion";

import bannerImg1 from "../../assets/img/Adobe.png";
import bannerImg2 from "../../assets/img/Mixer2.jpg";
import bannerImg3 from "../../assets/img/Adobe.png";

const Banner = () => {
  const products = [
    {
      id: 1,
      title: "Best Fridge collection for your kitchen",
      subTitle: "Welcome to CityShine",
      image: bannerImg1,
      layout: "left-text",
      bg: "bg-gradient-to-b from-blue-200 via-white to-blue-400 dark:bg-gradient-to-b dark:from-blue-300 dark:via-white/90 dark:to-blue-700",
    },
    {
      id: 2,
      title: "Luxury mixers for modern kitchens",
      subTitle: "Crafted with comfort and luxury",
      image: bannerImg2,
      layout: "left-text",
      bg: "bg-gradient-to-b from-yellow-100 dark:via-white to-yellow-300 dark:bg-gradient-to-b dark:from-yellow-300 via-white/90 dark:to-yellow-600",
    },
    {
      id: 3,
      title: "Elegant toasters for your kitchen",
      subTitle: "Luxury redefined",
      image: bannerImg3,
      layout: "right-text",
      bg: "bg-gradient-to-b from-purple-400 via-white to-purple-300 dark:bg-gradient-to-b dark:from-purple-800 dark:via-white/90 dark:to-purple-500",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.2 } },
  };

  const renderSlide = (data) => {
    switch (data.layout) {
      case "left-text":
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${data.bg} rounded-3xl`}>
            {/* Text left */}
            <Motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="flex flex-col justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-6 sm:py-12 text-center sm:text-left order-2 sm:order-1"
            >
              <h2 className="text-lg sm:text-3xl font-semibold text-gray-700">{data.subTitle}</h2>
              <h1 className="text-2xl sm:text-5xl font-bold text-blue-900">{data.title}</h1>
            </Motion.div>

            {/* Image right */}
            <Motion.div
              initial="hidden"
              animate="visible"
              variants={imageVariants}
              className="flex justify-center items-center order-1 sm:order-2 py-4 sm:py-0"
            >
              <img
                src={data.image}
                alt={data.title}
                className="w-[180px] sm:w-[400px] object-contain drop-shadow-xl"
              />
            </Motion.div>
          </div>
        );

      case "centered":
        return (
          <div className={`${data.bg} flex flex-col justify-center items-center text-center rounded-3xl py-8 sm:py-12`}>
            <Motion.img
              src={data.image}
              alt={data.title}
              initial="hidden"
              animate="visible"
              variants={imageVariants}
              className="w-[150px] sm:w-[400px] object-contain drop-shadow-lg mb-4 sm:mb-6"
            />
            <Motion.h2
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-base sm:text-2xl text-gray-600"
            >
              {data.subTitle}
            </Motion.h2>
            <Motion.h1
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-2xl sm:text-5xl font-bold text-yellow-800"
            >
              {data.title}
            </Motion.h1>
          </div>
        );

      case "right-text":
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${data.bg} rounded-3xl`}>
            {/* Image left */}
            <Motion.div
              initial="hidden"
              animate="visible"
              variants={imageVariants}
              className="flex justify-center items-center order-1 sm:order-1 py-4 sm:py-0"
            >
              <img
                src={data.image}
                alt={data.title}
                className="w-[180px] sm:w-[400px] object-contain drop-shadow-xl"
              />
            </Motion.div>

            {/* Text right */}
            <Motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="flex flex-col justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-6 sm:py-12 text-center sm:text-right order-2 sm:order-2"
            >
              <h2 className="text-lg sm:text-3xl font-semibold text-gray-500">{data.subTitle}</h2>
              <h1 className="text-2xl sm:text-5xl font-bold text-purple-900 dark:text-purple-500">{data.title}</h1>
            </Motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[500px] flex justify-center items-center relative z-10">
        <div className="w-full">
          <Slider {...settings}>
            {products.map((data) => (
              <div key={data.id}>{renderSlide(data)}</div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Banner;