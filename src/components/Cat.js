import React from "react";

const Cat = ({ catDots }) => {
  return (
    <div>
      {catDots.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        };
        return <div className="dot" key={i} style={style}></div>;
      })}
    </div>
  );
};

export default Cat;
