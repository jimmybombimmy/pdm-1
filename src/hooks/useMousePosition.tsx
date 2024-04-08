import { useState, useEffect } from 'react';

 const useMousePosition = () => {
  const [position, setPosition] = useState({ y: 0 });
  const [mouseDown, setMouseDown] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: any) => {
      setPosition({ y: e.clientY });
    };

    const updateMouseDown = () => {
      setMouseDown(true);
      window.addEventListener('mousemove', updateMousePosition);
    }

    const updateMouseUp = () => {
      setMouseDown(false); 
      window.removeEventListener('mousemove', updateMousePosition)
    }
    
    window.addEventListener('mousedown', updateMouseDown)
    window.addEventListener('mouseup', updateMouseUp)

     

  }, []);

  return {position, mouseDown};
};

export default useMousePosition
