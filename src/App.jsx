import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Calibrate from './Pages/Calibrate';
import AddDevice from './Pages/AddDevice';
import NotFound from './Pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calibrate" element={<Calibrate />} />
        <Route path="/add-device" element={<AddDevice />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
