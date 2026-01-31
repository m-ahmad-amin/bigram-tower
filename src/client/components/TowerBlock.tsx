import React from "react";

interface TowerBlockProps {
  text: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function TowerBlock({ text, onDragStart }: TowerBlockProps) {
  return (
    <div
      draggable
      className="
        w-32 h-16
        bg-white/10
        backdrop-blur-sm
        border border-white/20
        rounded-xl
        shadow-lg shadow-black/20
        flex items-center justify-center
        text-white font-medium tracking-wide
        cursor-grab select-none
        transition-all duration-300 ease-out
        hover:bg-white/20 hover:shadow-xl
        active:translate-y-0.5 active:shadow-md
      "
      onDragStart={onDragStart}
    >
      {text}
    </div>
  );
}