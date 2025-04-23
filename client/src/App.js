import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import { SocketProvider } from './providers/Socket';
function App() {
  return (
    <div className='App'>
   <Routes>
    <SocketProvider>
    <Route path='/' element={<Home/>} />
    <Route path='/h' element={<h1>Home1</h1>} />
    </SocketProvider>
   </Routes>
    </div>
  );
}

export default App;
