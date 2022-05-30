const combineCarouselMessage = (mergedCarousel, carousel) => {
  for (let i = 0; i < carousel["contents"]["contents"].length; i++) {
    mergedCarousel["contents"]["contents"].push(
      carousel["contents"]["contents"][i]
    );
  }

  return mergedCarousel;
};

module.exports = combineCarouselMessage;
