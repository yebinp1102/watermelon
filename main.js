import { Bodies, Engine, Render, World, Runner } from "matter-js";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body, // body 태그에 게임 렌더링
  options: {
    wireframes: false,
    background: "#F7F4CB",
    width: 620, // 기본 단위는 픽셀
    height: 850, 
  }
});

const world = engine.world;

// 벽 만들기
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const groundWall = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

// game over line
const topLine = Bodies.rectangle(310, 150, 620, 2, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

World.add(world, [leftWall, rightWall, groundWall, topLine])

Render.run(render);
Runner.run(engine);