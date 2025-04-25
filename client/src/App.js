import './App.css';
import { Routes, Route, useParams } from 'react-router-dom';
import Home from './Pages/Home';
import { SocketProvider } from './providers/Socket';
import Room from './Pages/Room';
import { PeerProvider } from './providers/Peer';
function App() {
  return (
    <div className='App'>
    <PeerProvider>
  <SocketProvider>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/room/:roomId' element={<Room/>} />
   </Routes>
  </SocketProvider>
    </PeerProvider>
    </div>
  );
}

export default App;
