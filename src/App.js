import './App.css';
import { socket } from './Connection/socket'
import { useEffect } from 'react';
import RoutesPage from './Elements/Routes';

function App() {
  return (
    <>
      <RoutesPage />
    </>
  );
}

export default App;
