function setKeywordsFlexMessage(keywords) {
  let flexMessage = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "매무리 봇",
          weight: "bold",
          color: "#1DB446",
          size: "sm",
        },
        {
          type: "text",
          text: "등록된 키워드",
          weight: "bold",
          size: "xxl",
          margin: "md",
        },
        {
          type: "separator",
          margin: "xxl",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "md",
        },
      ],
    },
  };

  for (let i = 0; i < keywords.length; i++) {
    const textbox = createKeywordTextBox(keywords[i]);
    flexMessage.body.contents[3].contents.push(textbox);
  }

  return {
    type: "flex",
    altText: "매무리 키워드 확인",
    contents: flexMessage,
  };
}

function createKeywordTextBox(keyword) {
  return {
    type: "text",
    text: keyword,
    size: "lg",
    align: "center",
    margin: "md",
  };
}

module.exports = setKeywordsFlexMessage;
