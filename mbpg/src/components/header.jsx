import React from 'react'
import { MusicIcon } from 'lucide-react';

const header = () => {
  return (
    <footer className=" flex justify-center items-center py-15">
      <div className='flex items-center gap-3'>
        <MusicIcon className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Mood Melodies
        </h1>
      </div>
    </footer>
  );
}

export default header