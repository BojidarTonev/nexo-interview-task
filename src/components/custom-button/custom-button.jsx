import React from "react";
import "./custom-button.scss";

export const CustomButton = (props) => {
  const { buttonText, onClickEvent, buttonType } = props;
  return (
    <button type={buttonType} className="custom-button" onClick={onClickEvent}>
      {buttonText}
    </button>
  );
};
