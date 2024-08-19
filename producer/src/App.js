import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Main from './components/Main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/producer/signup" element={<SignUp />} />
        <Route path="/producer/signin" element={<SignIn />} />
        <Route path="/producer/main" element={<Main />} />
        <Route path="/producer" element={<Navigate to="/producer/signin" />} />
        <Route path="/" element={<Navigate to="/producer" />} />
      </Routes>
    </Router>
  );
};

export default App;
