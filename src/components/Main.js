import React, { useState, useEffect, useCallback } from "react";
import Mouse from "./Mouse";
import Cat from "./Cat";
import startGame from "../sounds/startGame.wav";
import eatenSound from "../sounds/eaten.wav";
import gameOver from "../sounds/gameOver.wav";

function Main() {
  const [score, setScore] = useState(0);

  // Random Co ords
  const getRandomGrid = () => {
    const min = 10;
    const max = 98;
    const x = Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
    const y = Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
    return [x, y];
  };

  const [food, setFood] = useState(getRandomGrid);
  const [nextFoodPoint, setNextFoodPoint] = useState(getRandomGrid);
  const [direction, setDirection] = useState("RIGHT");
  const [catDots, setCatDots] = useState([[0, 0]]);
  const [speed, setSpeed] = useState(16);
  const [reset, setReset] = useState(true);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    new Audio(startGame).play();
  }, []);

  const checkIfEate = () => {
    const size = 8;
    const foodCenterDot = [food[0] + 1, food[1] + 1];
    const catDot1 = [...catDots[0]];
    const catDot2 = [catDot1[0] + 5, catDot1[1]];
    const catDot3 = [catDot1[0], catDot1[1] + size];
    const catDot4 = [catDot1[0] + 5, catDot1[1] + size];

    return (
      foodCenterDot[0] >= catDot1[0] &&
      foodCenterDot[1] >= catDot1[1] &&
      foodCenterDot[0] <= catDot2[0] &&
      foodCenterDot[1] >= catDot2[1] &&
      foodCenterDot[0] >= catDot3[0] &&
      foodCenterDot[1] <= catDot3[1] &&
      foodCenterDot[0] <= catDot4[0] &&
      foodCenterDot[1] <= catDot4[1]
    );
  };

  const onNewGame = () => {
    setDirection("RIGHT");
    setCatDots([[0, 0]]);
    setReset(true);
    setScore(0);
  };

  const onGameOver = () => {
    setPause(true);
    setReset(false);
    new Audio(gameOver).play();
  };

  const checkIfCollabsed = () => {
    const cat = [...catDots];
    const head = catDots[cat.length - 1];
    cat.pop();
    cat.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };

  const checkIfOutSide = () => {
    const head = catDots[catDots.length - 1];
    if (head[0] >= 95 || head[1] >= 95 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };

  const moveMouse = useCallback(() => {
    let dots = [...food];
    const dotX = Math.floor(dots[0]);
    const dotY = Math.floor(dots[1]);

    if (dotX === nextFoodPoint[0] && dotY === nextFoodPoint[1])
      setNextFoodPoint(getRandomGrid());

    if (dotX < nextFoodPoint[0]) setFood([dots[0] + 0.1, dots[1]]);
    if (dotX > nextFoodPoint[0]) setFood([dots[0] - 0.1, dots[1]]);
    if (dotY < nextFoodPoint[1]) setFood([dots[0], dots[1] + 0.2]);
    if (dotY > nextFoodPoint[1]) setFood([dots[0], dots[1] - 0.2]);
  }, [food, nextFoodPoint]);

  const moveCat = useCallback(
    (catDots, eaten) => {
      const dots = [...catDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case "RIGHT":
          head = [head[0] + 0.2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 0.2, head[1]];
          break;
        case "UP":
          head = [head[0], head[1] - 0.4];
          break;
        case "DOWN":
          head = [head[0], head[1] + 0.4];
          break;
        default:
          break;
      }
      if (direction) {
        dots.push(head);
        dots.shift();
        if (eaten) {
          setFood(getRandomGrid());
          setNextFoodPoint(getRandomGrid());
          setScore(score + 1);
          setSpeed(speed - 0.5);
          new Audio(eatenSound).play();
        }
        setCatDots([...dots]);
      }
    },
    [direction]
  );

  useEffect(() => {
    if (pause) return;

    moveMouse();

    checkIfOutSide();

    checkIfCollabsed();

    setTimeout(() => moveCat(catDots, checkIfEate()), speed);
  }, [catDots, pause]);

  useEffect(() => {
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          !["UP", "DOWN"].includes(direction) && setDirection("UP");
          break;
        case 40:
          !["UP", "DOWN"].includes(direction) && setDirection("DOWN");
          break;
        case 37:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("LEFT");
          break;
        case 39:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [direction, setDirection]);
  return (
    <>
      <div className="all_page">
        <div className="general_part">
          <div className="score">CATCHED MOUSES: {score}</div>

          {reset ? (
            <button className="btn" onClick={() => setPause((p) => !p)}>
              {pause ? "PLAY" : "PAUSE"}
            </button>
          ) : (
            <button className="new_game_btn" onClick={() => onNewGame()}>
              NEW GAME
            </button>
          )}
        </div>
        <div className="board">
          <Cat catDots={catDots} />
          <Mouse dot={food} />
        </div>
      </div>
    </>
  );
}

export default Main;
