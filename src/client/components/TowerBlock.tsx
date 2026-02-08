import React from 'react';

interface TowerBlockProps {
  text: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  isTower?: boolean;
  isUndo?: boolean;
}

export default function TowerBlock({
  text,
  onDragStart,
  isTower = false,
  isUndo = false,
}: TowerBlockProps) {
  const styles = `
    @keyframes floating {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0.2; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        className={`rounded-xl magic-particles ${!isTower && !isUndo ? 'bg-[#22223b]' : ''}
  }`}
        draggable={!isTower && !isUndo}
        onDragStart={onDragStart}
        style={{
          width: isTower ? '100%' : '7rem',
          height: isTower ? '100%' : '3rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          border: isUndo ? '2px dashed rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.5)',
          color: 'white',
          fontWeight: 600,
          letterSpacing: '0.05em',
          cursor: isTower ? 'default' : isUndo ? 'pointer' : 'grab',
          overflow: 'hidden',
          transition: 'all 0.3s ease-out',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 15px rgba(255,255,255,0.2)';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        }}
      >
        {text}
      </div>
    </>
  );
}