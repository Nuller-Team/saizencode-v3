import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  on_close: () => void;
  category: Category | null;
  menuItem: MenuItem | null;
}

export default function Modal({ isOpen, on_close, category, menuItem }: ModalProps) {
  const [visible, set_visible] = useState(false);
  const [animate_out, set_animate_out] = useState(false);

  useEffect(() => {
    if (isOpen) {
      set_visible(true);
      set_animate_out(false);
    } else {
      set_animate_out(true);
      setTimeout(() => {
        set_visible(false);
      }, 300);
    }
  }, [isOpen, category, menuItem]); 
  const handle_close = () => {
    set_animate_out(true);
    setTimeout(() => {
      on_close();
      set_visible(false);
    }, 300);
  };

  const handle_overlay= (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handle_close();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-[101] ${animate_out ? 'animate-fadeOut' : 'animate-fadeIn'}`} onClick={handle_overlay}>
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl md:mx-6 mx-4" onClick={e => e.stopPropagation()}>
        <div className="float-right">
          <button className="bg-gray-200 text-lg w-10 h-10 m-auto rounded-full flex justify-center items-center" onClick={handle_close}>
            <svg className="h-6 w-6 stroke-neutral-600 stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-10">
          <div className="mb-6">
            <div className="bg-gray-100 w-24 h-24 text-6xl items-center flex justify-center rounded-full m-auto">
              {category?.emoji}
            </div>
          </div>
          <p className="text-gray-400 text-center font-bold">{menuItem?.id}</p>
          <h2 className="text-xl font-bold mb-4 text-center text-neutral-600">{menuItem?.name}</h2>
          <div className="flex items-center text-neutral-600 min-w-[80px] justify-end">
            <div className="m-auto">
              <span className="text-2xl font-bold">{menuItem?.tax_price}</span>
              <span className="text-sm mx-0.5 my-auto">円</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
