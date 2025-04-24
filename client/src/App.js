import './App.css';
import { Routes, Route, useParams } from 'react-router-dom';
import Home from './Pages/Home';
import { SocketProvider } from './providers/Socket';
import Room from './Pages/Room';
function App() {
  return (
    <div className='App'>
  <SocketProvider>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/room/:roomId' element={<Room/>} />
   </Routes>
  </SocketProvider>
    </div>
  );
}

export default App;
