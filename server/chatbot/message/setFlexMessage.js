function priceToString(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setFlexMessage(
  platform,
  name,
  price,
  thumbnailUrl,
  itemUrl,
  extraInfo
) {
  let koreanPlatformName = "";
  if (platform === "daangn" || platform === "당근마켓") {
    koreanPlatformName = "당근마켓";
  } else if (platform === "joongna" || platform === "중고나라") {
    koreanPlatformName = "중고나라";
  } else if (platform === "bunjang" || platform === "번개장터") {
    koreanPlatformName = "번개장터";
  } else {
    koreanPlatformName = "Unknown";
  }

  let flexMessage = {
    type: "bubble",
    hero: {
      type: "image",
      url: thumbnailUrl,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
      action: {
        type: "uri",
        uri: itemUrl,
      },
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: name,
          weight: "bold",
          size: "xl",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "플랫폼",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: koreanPlatformName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "가격",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: priceToString(price * 1) + "원",
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "정보",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: extraInfo,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "link",
          height: "sm",
          action: {
            type: "uri",
            label: "매물 확인",
            uri: itemUrl,
          },
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };
  return flexMessage;
  //return JSON.stringify(flexMessage);
}

module.exports = setFlexMessage;
