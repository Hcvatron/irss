import React from "react";
import './Banner.css';

const Banner = () => {
    const items = [
        { label: "Business", icon: "https://img.icons8.com/ios/50/new-job.png" },
        { label: "Credit cards", icon: "https://img.icons8.com/ios/50/bank-card-back-side--v1.png" },
        { label: "Checking", icon: "https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/96/external-checking-immigration-tanah-basah-basic-outline-tanah-basah.png" },
        { label: "Travel", icon: "https://img.icons8.com/ios/50/sunbathe.png" },
        { label: "Savings", icon: "https://img.icons8.com/ios/50/money-box--v1.png" },
      ];
    
      return (
        <div className="banner-container">
          <h2>Choose what's right for you</h2>
          <div className="banner-items">
            {items.map((item, index) => (
              <div key={index} className="banner-item">
                <div className="banner-icon" style={{ fontSize: "40px" }}>
                  <img src={item.icon} alt="" />
                </div>
                <p className="banner-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      );
};

export default Banner;
