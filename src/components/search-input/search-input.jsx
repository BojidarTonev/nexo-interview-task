import React, { useState } from "react";
import "./search-input.scss";

export const SearchInput = (props) => {
  const { labelName, onChangeCb, value, id } = props;
  const onChange = (event) => {
    const { value } = event.target;
    onChangeCb(labelName, value);
  };
  return (
    <div className="search-input">
      <label htmlFor={id}>{labelName}</label>
      <input id={id} type="text" value={value} onChange={onChange} />
    </div>
  );
};
