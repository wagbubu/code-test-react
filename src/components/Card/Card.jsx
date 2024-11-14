import React, { useState } from "react";
import "./card.scss";

export default function Card({ lastRef, header, badge, year, imagesLink }) {
  const [showContent, setShowContent] = useState(false);
  const images =
    imagesLink && imagesLink.length > 0 ? (
      imagesLink.map((imageLink) => (
        <img alt="mission images" src={imageLink} />
      ))
    ) : (
      <p>"No images"</p>
    );

  return (
    <div ref={lastRef} className="card">
      <div className="card-header">
        <h1>{header}</h1>
        <div>
          {badge.upcoming ? (
            <p className="badge blue">upcoming</p>
          ) : badge.launchSuccess ? (
            <p className="badge green">success</p>
          ) : (
            <p className="badge red">failed</p>
          )}
        </div>
      </div>
      <div className="card-body">
        <p className="date">in year {new Date(year * 1000).getFullYear()}</p>
        {/* map image here */}
        {showContent && images}
      </div>
      <button className="btn" onClick={() => setShowContent(!showContent)}>
        {showContent ? "HIDE" : "VIEW"}
      </button>
    </div>
  );
}
