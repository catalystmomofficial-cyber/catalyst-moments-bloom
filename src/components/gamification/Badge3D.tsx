import { ReactNode, Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import type { AwardRarity } from './AwardBadge';

interface Badge3DProps {
  icon: ReactNode;
  rarity?: AwardRarity;
  locked?: boolean;
  size?: number;
  /** 'reveal' spins fast then settles — for the unlock moment. 'idle' spins gently forever. 'hover' only spins on hover. */
  mode?: 'reveal' | 'idle' | 'hover';
  className?: string;
}

// Real metal colors + roughness per rarity — legendary reads shiniest, common
// the dullest, matching the brand's copper/gold identity instead of a generic
// rainbow of rarities.
const metalTone: Record<AwardRarity, { color: string; roughness: number; emissive: string }> = {
  legendary: { color: '#E8C468', roughness: 0.18, emissive: '#7A5A18' },
  epic: { color: '#D68B54', roughness: 0.24, emissive: '#6B3E1C' },
  rare: { color: '#C9AA7E', roughness: 0.3, emissive: '#4E3B22' },
  common: { color: '#CFC3AC', roughness: 0.36, emissive: '#3A3226' },
};
const lockedTone = { color: '#8A8377', roughness: 0.55, emissive: '#1c1a16' };

function Coin({ rarity, locked, mode }: { rarity: AwardRarity; locked: boolean; mode: 'reveal' | 'idle' | 'hover' }) {
  const groupRef = useRef<THREE.Group>(null);
  const hovering = useRef(false);
  const elapsed = useRef(0);
  const tone = locked ? lockedTone : metalTone[rarity];

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    elapsed.current += delta;

    if (mode === 'reveal') {
      // Fast spin that eases into a slow settle over ~2.2s, then idles softly.
      const t = Math.min(elapsed.current / 2.2, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const spins = 3.5 * eased;
      groupRef.current.rotation.y = spins * Math.PI * 2 + Math.sin(elapsed.current * 0.6) * 0.05;
    } else if (mode === 'idle') {
      groupRef.current.rotation.y += delta * 0.35;
    } else if (mode === 'hover' && hovering.current) {
      groupRef.current.rotation.y += delta * 1.6;
    } else if (mode === 'hover') {
      // ease back to facing forward when not hovering
      groupRef.current.rotation.y *= 0.9;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => (hovering.current = true)}
      onPointerOut={() => (hovering.current = false)}
    >
      {/* Coin body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.26, 72]} />
        <meshStandardMaterial
          color={tone.color}
          metalness={locked ? 0.5 : 1}
          roughness={tone.roughness}
          emissive={tone.emissive}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Raised rim for a beveled-coin edge highlight — no rotation needed,
          a torus's ring already faces the camera by default (unlike the
          cylinder above, which needs the 90° flip). */}
      <mesh>
        <torusGeometry args={[1, 0.05, 20, 72]} />
        <meshStandardMaterial
          color={tone.color}
          metalness={locked ? 0.5 : 1}
          roughness={Math.max(tone.roughness - 0.08, 0.08)}
          emissive={tone.emissive}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

/**
 * A real, lit 3D medallion (react-three-fiber) that replaces the flat CSS
 * "metallic gradient" badge with an actual spinning coin — genuine reflections
 * and depth instead of a faked sheen animation. The icon is layered on top as
 * a normal 2D element so it stays crisp while the coin turns beneath it.
 */
export function Badge3D({ icon, rarity = 'common', locked = false, size = 96, mode = 'idle', className = '' }: Badge3DProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.1], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: mode === 'hover' ? 'auto' : 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          {/* Procedural (network-free) reflections — no HDR download, so this
              never blanks out on a slow connection or a privacy/ad blocker. */}
          <Environment resolution={64}>
            <Lightformer form="rect" intensity={3} color="#fff8ea" scale={[6, 6, 1]} position={[-3, 3, 4]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={1.5} color="#ffd9a0" scale={[4, 4, 1]} position={[3, -2, 3]} target={[0, 0, 0]} />
            <Lightformer form="ring" intensity={2} color="#ffffff" scale={[8, 8, 1]} position={[0, 0, -6]} target={[0, 0, 0]} />
          </Environment>
          <Coin rarity={rarity} locked={locked} mode={mode} />
        </Suspense>
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          color: locked ? '#514A3E' : '#3A2412',
          filter: locked
            ? 'drop-shadow(0 1px 0.5px rgba(255,255,255,0.35))'
            : 'drop-shadow(0 1px 1px rgba(255,255,255,0.5)) drop-shadow(0 -1px 2px rgba(0,0,0,0.25))',
        }}
      >
        <div className="[&_svg]:[stroke-width:2.4px]" style={{ width: size * 0.42, height: size * 0.42 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
