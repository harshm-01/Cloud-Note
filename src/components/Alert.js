import React from "react";

function Alert(props) {
  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const temp = word.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };

  return (
    //CUMULATIVE LAYOUT SHIFT
    <div style={{ height: "50px" }}>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.tp} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{capitalize(props.alert.tp)}</strong>: {props.alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;
