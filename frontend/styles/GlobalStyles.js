import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #121212;
    color: white;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: #E5C100; // Gold for links
  }

  button {
    transition: 0.3s;
  }

  button:hover {
    opacity: 0.8;
  }
`;

export default GlobalStyles;
