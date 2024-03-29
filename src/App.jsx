import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Quiz from './pages/Quiz';
import Chirper from './pages/Chirper';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/chirper" element={<Chirper />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
