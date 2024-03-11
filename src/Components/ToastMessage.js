import React from "react";

const ToastMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="toast-message">{message}</div>;
};

export default ToastMessage;
