import { Bodies, Engine, Render, World, Runner, Body, Events } from "matter-js";
import { FRUITS_BASE } from './fruits.js';

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
  name: "topLine",
  isStatic: true,
  isSensor: true, // 과일이 topLine에 걸리지 않도록 설정. true 설정 시 부딪히지 않고 감지 기능만 갖게됨.
  render: {fillStyle: "#E6B143"}
});

World.add(world, [leftWall, rightWall, groundWall, topLine])

Render.run(render);
Runner.run(engine);

let currentBody = null; // 현재 조작 가능한 과일의 좌표
let currentFruit = null; // 현재 조작한 과일의 이름, 이미지
let disableAction = false; // 과일 드랍 후 딜레이 주기 위한 상태값


// 과일 생성
function addFruits(){
  const index = Math.floor(Math.random() * 5); // cherry ~ Orange 중 랜덤으로 과일 추가
  const fruit = FRUITS_BASE[index];

  // 과일 추가
  const body = Bodies.circle(300, 50, fruit.radius, {
    index, 
    isSleeping: true, // 사용자가 클릭하기 전까지 떨어지지 않음
    render: {
      sprite: { texture: `${fruit.name}.png`}
    },
    restitution: 0.2,// 과일에 탄성 추가
  }) // 과일은 중앙에 떨어뜨려야함 

  currentBody = body;
  currentFruit = fruit

  World.add(world, body);
}

// 과일 움직이기
// 키보드의 입력을 감지하기 위해서 onKeyDown 함수 사용
window.onkeydown = (evnet) => {
  // disableAction가 true인 경우 키보드 값을 인식하지 않음. 
  if(disableAction) return;
  switch(evnet.code){
    // A: 과일 왼쪽 이동
    case "KeyA": 
      if(currentBody.position.x - currentFruit.radius > 30)
        Body.setPosition(currentBody, {
        x: currentBody.position.x-10,
        y: currentBody.position.y
      })
      break;

    // D: 과일 오른쪽 이동
    case "KeyD": 
    if(currentBody.position.x + currentFruit.radius < 590)
      Body.setPosition(currentBody, {
        x: currentBody.position.x+10,
        y: currentBody.position.y
      })
      break;

    // S: 과일 떨어뜨리기  
    // 과일을 떨어뜨리는 동시에 새 과일 추가. 그리고 1초동안 키보드 값을 인식하지 않음.
    case "KeyS": 
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruits()
        disableAction = false;
      }, 1000);
      break;
  }
}

// collisionStart: 충돌이 시작될 때 이벤트 함수 호출
Events.on(engine, "collisionStart", (event) => {

  event.pairs.forEach((collision) => {

    // 두개의 과일이 충돌 했을 때, 같은 과일인지 확인
    if(collision.bodyA.index === collision.bodyB.index){

      // 충돌한 과일의 인덱스 번호
      const index = collision.bodyA.index;

      // 충돌한 두 과일이 수박이면 다음 과일이 없으니 이벤트 함수 종료
      if(index === FRUITS_BASE.length-1) return;

      // 충돌한 과일이 같은 과일이면 둘 다 제거
      World.remove(world, [collision.bodyA, collision.bodyB])

      // 과일이 없어진 자리에 다음 단계의 과일이 하나 등장
      const newFruit = FRUITS_BASE[index+1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x, // 부딪힌 지점의 X 좌표
        collision.collision.supports[0].y, // 부딪힌 지점의 Y 좌표
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index: index+1
        }
      )

      World.add(world, newBody);
    }

    // 과일을 떨어뜨릴 땐 topLine에 닿아도 됨.
    if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
      alert("Game Over");
    }
  })
})

addFruits();
