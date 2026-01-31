import React from "react";

interface TowerBlockProps {
  text: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  isTower?: boolean;
}

export default function TowerBlock({
  text,
  onDragStart,
  isTower = false,
}: TowerBlockProps) {
  return (
    <div
      draggable={!isTower}
      onDragStart={onDragStart}
      className={`
        ${isTower ? "w-full h-full" : "w-40 h-20"}
        bg-white/10
        backdrop-blur-sm
        border border-white/20
        shadow-lg shadow-black/20
        flex items-center justify-center
        text-white font-medium tracking-wide
        cursor-grab select-none
        transition-all duration-300 ease-out
        hover:bg-white/20 hover:shadow-xl
        active:translate-y-0.5 active:shadow-md
      `}
    >
      {text}
    </div>
  );
}