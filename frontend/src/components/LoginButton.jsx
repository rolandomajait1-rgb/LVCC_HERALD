import React from 'react';

const LoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-40 px-12 py-3 bg-cyan-800 hover:bg-cyan-900 text-white font-medium rounded-lg shadow transition duration-150 border border-white"
    >
      Log In
    </button>
  );
};

export default LoginButton;
