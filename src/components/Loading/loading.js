import React from "react";
import "./loading.css";

export default function LoadingSpinner() {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>
    </div>
  );
}