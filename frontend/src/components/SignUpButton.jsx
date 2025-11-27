import React from 'react';

const SignUpButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-40 px-12 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow transition duration-110 border border-white"
    >
      Sign Up
    </button>
  );
};

export default SignUpButton;
