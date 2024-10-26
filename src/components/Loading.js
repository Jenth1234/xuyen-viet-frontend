// import React, { useEffect, useState } from 'react';
// import styled, { keyframes } from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: #000;
// `;

// const LoadingContainer = styled.div`
//   position: relative;
//   width: 400px;
//   height: 150px;
// `;

// const moveRandomly = keyframes`
//   0% { transform: translate(0, 0); }
//   25% { transform: translate(30px, -20px); }
//   50% { transform: translate(-20px, 30px); }
//   75% { transform: translate(10px, -10px); }
//   100% { transform: translate(0, 0); }
// `;

// const moveToLetter = (left, top) => keyframes`
//   0% { transform: translate(0, 0); }
//   100% { transform: translate(${left}, ${top}); }
// `;

// const Firefly = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background-color: yellow;
//   border-radius: 50%;
//   box-shadow: 0 0 10px yellow, 0 0 20px yellow;
//   animation: ${({ move }) => (move ? move : moveRandomly)} 2s infinite;
// `;

// const Fireflies = () => {
//   const positions = [
//     // J
//     { left: '20px', top: '20px' },
//     { left: '20px', top: '40px' },
//     { left: '20px', top: '60px' },
//     { left: '20px', top: '80px' },
//     { left: '20px', top: '100px' },
//     { left: '5px', top: '120px' },
//     { left: '-20px', top: '120px' },
//     { left: '-40px', top: '100px' },
//     // A
//     { left: '100px', top: '20px' },
//     { left: '90px', top: '40px' },
//     { left: '80px', top: '60px' },
//     { left: '70px', top: '80px' },
//     { left: '60px', top: '100px' },
//     { left: '50px', top: '120px' },
//     { left: '150px', top: '120px' },
//     { left: '110px', top: '40px' },
//     { left: '120px', top: '60px' },
//     { left: '130px', top: '80px' },
//     { left: '140px', top: '100px' },
//     // C
//     { left: '260px', top: '20px' },
//     { left: '240px', top: '20px' },
//     { left: '220px', top: '20px' },
//     { left: '200px', top: '30px' },
//     { left: '190px', top: '50px' },
//     { left: '190px', top: '70px' },
//     { left: '190px', top: '90px' },
//     { left: '200px', top: '110px' },
//     { left: '220px', top: '120px' },
//     { left: '240px', top: '120px' },
//     { left: '260px', top: '120px' },
//     // K
//     { left: '320px', top: '20px' },
//     { left: '320px', top: '40px' },
//     { left: '320px', top: '60px' },
//     { left: '320px', top: '80px' },
//     { left: '320px', top: '100px' },
//     { left: '320px', top: '120px' },
//     { left: '380px', top: '20px' },
//     { left: '360px', top: '40px' },
//     { left: '340px', top: '60px' },
//     { left: '340px', top: '80px' },
//     { left: '360px', top: '100px' },
//     { left: '380px', top: '120px' }
//   ];

//   const [fly, setFly] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFly(true);
//     }, 12000); // Sau 12 giây, bắt đầu ghép chữ

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <LoadingContainer>
//       {positions.map((pos, index) => (
//         <Firefly
//           key={index}
//           style={{ left: pos.left, top: pos.top }}
//           move={fly ? moveToLetter(pos.left, pos.top) : null}
//         />
//       ))}
//     </LoadingContainer>
//   );
// };

// const App = () => {
//   return (
//     <Container>
//       <Fireflies />
//     </Container>
//   );
// };

// export default App;
