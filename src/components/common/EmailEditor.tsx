"use client";

import React, { useState } from "react";
import TooltipCommon from "./TooltipCommon";
import "../../styles/editor.css";
import {
  BulletsListUIconSVG,
  CheckListUIconSVG,
  NumberListUIconSVG,
  TextBoldUIconSVG,
  TextCenterUIconSVG,
  TextItalicUIconSVG,
  TextLeftUIconSVG,
  TextRightUIconSVG,
  TextStrikeUIconSVG,
  TextUnderlineUIconSVG,
} from "@/utils/SVGs/SVGs";

const EmailEditor = () => {
  const [textValue, setTextValue] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underlineText, setUnderlineText] = useState(false);
  const [textLeft, setTextLeft] = useState(false);
  const [textCenter, setTextCenter] = useState(false);
  const [numberList, setNumberList] = useState(false);
  const [bulletList, setBulletList] = useState(false);
  const [textRight, setTextRight] = useState(false);
  const [checkList, setCheckList] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [textSize, setTextSize] = useState("Normal");
  const [textColor, setTextColor] = useState("Normal");
  const [newText, setNewText] = useState("");

  const [textStyle, setTextStyle] = useState({
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textDecorationLine: "none",
  });



  // const kk = document.getElementById("textarea")?.innerHTML;
  // let newPara = document.createElement("p");
  // let ff = document.createTextNode(kk);
  // newPara.appendChild(ff);
  // console.log("newPara", newPara);
  // if (kk) {
  //   if (bold) {
  //     newPara.className = "bold";
  //   }
  // }

  // setNewText(newPara);
  // console.log("newPara", newPara);

  const toggleBold = () => {
    // console.log("mmmm");
    setBold(!bold);
  };

  const toggleItalic = () => {
    setItalic(!italic);
  };

  const toggleUnderline = () => {
    setUnderlineText(!underlineText);
  };

  const ToggleTextLeft = () => {
    setTextLeft(!textLeft);
  };

  const ToggleTextCenter = () => {
    setTextCenter(!textCenter);
  };

  const ToggleTextRight = () => {
    setTextRight(!textRight);
  };

  const toggleStrikethrough = () => {
    setStrikethrough(!strikethrough);
  };

  const toggleNumberList = () => {
    setNumberList(!numberList);
  };

  const toggleCheckList = () => {
    setCheckList(!checkList);
  };

  const toggleBulletList = () => {
    setBulletList(!bulletList);
  };

  const handleTextSizeChange = (e: any) => {
    setTextSize(e.target.value);
  };

  const onChangeHandler = (e: any) => {
    setTextValue(e.target.value);
  };

  // const getTextAreaStyle = () => {
  //   return {
  //     fontWeight: bold ? "bold" : "normal",
  //     fontStyle: italic ? "italic" : "normal",
  //     textDecorationLine:
  //       underlineText && strikethrough
  //         ? "underline line-through"
  //         : strikethrough
  //         ? "line-through"
  //         : underlineText
  //         ? "underline"
  //         : "none",
  //     textAlign: textLeft
  //       ? "left"
  //       : textCenter
  //       ? "center"
  //       : textRight
  //       ? "right"
  //       : "left",
  //     fontSize:
  //       textSize === "Small"
  //         ? "12px"
  //         : textSize === "Normal"
  //         ? "16px"
  //         : textSize === "Large"
  //         ? "20px"
  //         : textSize === "Huge"
  //         ? "24px"
  //         : "",
  //     color: textColor ? textColor : "#000",
  //   };
  // };

  const getTextAreaStyle = () => {
    let textAlign: React.CSSProperties["textAlign"] = "left";

    if (textLeft) {
      textAlign = "left";
    } else if (textCenter) {
      textAlign = "center";
    } else if (textRight) {
      textAlign = "right";
    }

    return {
      fontWeight: bold ? "bold" : "normal",
      fontStyle: italic ? "italic" : "normal",
      textDecorationLine:
        underlineText && strikethrough
          ? "underline line-through"
          : strikethrough
          ? "line-through"
          : underlineText
          ? "underline"
          : "none",
      textAlign, // Use the explicitly typed variable here
      fontSize:
        textSize === "Small"
          ? "12px"
          : textSize === "Normal"
          ? "16px"
          : textSize === "Large"
          ? "20px"
          : textSize === "Huge"
          ? "24px"
          : "",
      color: textColor ? textColor : "#000",
    };
  };

  return (
    <div className="my-5">
      {textSize}
      <div className="border flex gap-3 px-5">
        <div
          onClick={() => toggleBold()}
          className={` ${bold ? "bg-blue-400" : ""} cursor-pointer`}
        >
          <TooltipCommon text="Text Bold">
            <TextBoldUIconSVG />
          </TooltipCommon>
        </div>
        <div
          className={` ${italic ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleItalic}
        >
          <TooltipCommon text="Text Itelic">
            <TextItalicUIconSVG />
          </TooltipCommon>
        </div>
        <div
          className={` ${underlineText ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleUnderline}
        >
          <TooltipCommon text="Text Underline">
            <TextUnderlineUIconSVG />
          </TooltipCommon>
        </div>
        <div
          className={` ${strikethrough ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleStrikethrough}
        >
          <TooltipCommon text="Text Strikethrough">
            <TextStrikeUIconSVG />
          </TooltipCommon>
        </div>
        <div className="mx-3"></div>
        <div className="cursor-pointer">
          <TooltipCommon text="Text Size">
            <select
              className="h-full font-bold cursor-pointer"
              value={textSize}
              onChange={handleTextSizeChange}
            >
              <option value="Small" className="cursor-pointer">
                Small
              </option>
              <option value="Normal" className="cursor-pointer">
                Normal
              </option>
              <option value="Large" className="cursor-pointer">
                Large
              </option>
              <option value="Huge" className="cursor-pointer">
                Huge
              </option>
            </select>
          </TooltipCommon>
        </div>
        <div className="cursor-pointer flex justify-center items-center font-bold mx-3">
          <TooltipCommon text="Upload Files">
            <span className="mx-1">Upload Files</span>
          </TooltipCommon>
          <svg
            width="20"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5036 4.43392C19.4547 3.57212 20.7008 3.10909 21.9839 3.14068C23.267 3.17227 24.4888 3.69607 25.3964 4.60363C26.304 5.51119 26.8278 6.733 26.8593 8.01609C26.8909 9.29919 26.4279 10.5453 25.5661 11.4964C25.5567 11.5069 25.547 11.5171 25.5371 11.5271L13.1246 24.1146C13.1114 24.128 13.0979 24.1409 13.084 24.1535C12.5133 24.6706 11.7657 24.9484 10.9958 24.9295C10.226 24.9105 9.49287 24.5962 8.94833 24.0517C8.40379 23.5072 8.08952 22.7741 8.07056 22.0042C8.05161 21.2344 8.32943 20.4867 8.84651 19.916C8.85566 19.9059 8.86502 19.896 8.87458 19.8863L19.2871 9.29878C19.6743 8.90501 20.3075 8.89974 20.7012 9.28699C21.095 9.67425 21.1003 10.3074 20.713 10.7012L10.3173 21.2716C10.1522 21.4601 10.0638 21.704 10.07 21.955C10.0763 22.2116 10.181 22.456 10.3625 22.6375C10.5441 22.819 10.7884 22.9237 11.045 22.9301C11.2939 22.9362 11.5358 22.8493 11.7237 22.6869L24.0971 10.1389C24.6058 9.57014 24.8787 8.82864 24.86 8.06532C24.841 7.29546 24.5267 6.56238 23.9822 6.01784C23.4376 5.47331 22.7046 5.15903 21.9347 5.14007C21.1735 5.12133 20.4341 5.39269 19.8659 5.89857L7.46968 18.4696C6.53336 19.4059 6.00732 20.6758 6.00732 22C6.00732 23.3241 6.53334 24.594 7.46966 25.5304C8.40598 26.4667 9.6759 26.9927 11.0001 26.9927C12.3242 26.9927 13.5941 26.4667 14.5304 25.5304L24.7938 15.292C25.1848 14.902 25.818 14.9027 26.208 15.2937C26.5981 15.6847 26.5973 16.3179 26.2063 16.7079L15.9447 26.9446C14.6333 28.256 12.8546 28.9927 11.0001 28.9927C9.14547 28.9927 7.36684 28.256 6.05545 26.9446C4.74406 25.6332 4.00732 23.8546 4.00732 22C4.00732 20.1466 4.74309 18.3691 6.05286 17.0579L18.463 4.47283C18.4762 4.45948 18.4897 4.44651 18.5036 4.43392Z"
              fill="black"
            />
          </svg>
        </div>
        <div
          className={` ${numberList ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleNumberList}
        >
          <TooltipCommon text="Number List">
            <NumberListUIconSVG />
          </TooltipCommon>
        </div>

        <div
          className={` ${bulletList ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleBulletList}
        >
          <TooltipCommon text="Bullet List">
            <BulletsListUIconSVG />
          </TooltipCommon>
        </div>
        <div
          className={` ${checkList ? "bg-blue-400" : ""} cursor-pointer`}
          onClick={toggleCheckList}
        >
          <TooltipCommon text="Checkbox List">
            <CheckListUIconSVG />
          </TooltipCommon>
        </div>
        <div className="cursor-pointer" onClick={ToggleTextLeft}>
          <TooltipCommon text="Text-Left">
            <TextLeftUIconSVG />
          </TooltipCommon>
        </div>
        <div className="cursor-pointer" onClick={ToggleTextCenter}>
          <TooltipCommon text="Text-Center">
            <TextCenterUIconSVG />
          </TooltipCommon>
        </div>
        <div className="cursor-pointer" onClick={ToggleTextRight}>
          <TooltipCommon text="Text-Right">
            <TextRightUIconSVG />
          </TooltipCommon>
        </div>
        <div className="flex items-center">
          <TooltipCommon text="Text Color">
            <input
              type="color"
              name=""
              id=""
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </TooltipCommon>
        </div>
        {/* <div className="flex items-center ">
          <TooltipCommon text="Background Color">
            <input type="color" name="" id="" />
          </TooltipCommon>
        </div> */}
      </div>

      <div className="">
        <textarea
          id="textarea"
          className="border w-full h-48 p-3 outline-none"
          value={textValue}
          onChange={onChangeHandler}
          style={getTextAreaStyle()}
          placeholder="Type your email content here..."
          aria-label="Email Content"
        />
      </div>
    </div>
  );
};

export default EmailEditor;
