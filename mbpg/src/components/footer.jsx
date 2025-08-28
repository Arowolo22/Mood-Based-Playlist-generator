import React from 'react'

const footer = () => {
  return (
    <footer className="flex justify-center items-center mt-auto tex-sm py-6 text-gray-500">
      <p>
        © {new Date().getFullYear()} Find your perfect
        soundtrack
      </p>
    </footer>
  );
}

export default footer