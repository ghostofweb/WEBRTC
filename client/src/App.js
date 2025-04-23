import './App.css';
import { Routes,Router, Route } from 'react-router-dom';
import Home from './Pages/Home';
function App() {
  return (
    <div className='App'>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/h' element={<h1>Home1</h1>} />
   </Routes>
    </div>
  );
}

export default App;
