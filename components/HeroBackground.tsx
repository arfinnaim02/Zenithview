"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  eventSource: RefObject<HTMLElement>;
};

function WebField() {
  const group = useRef<Group | null>(null);

  const geometry = useMemo(() => {
    const vertexCount = 420;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(vertexCount * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 9;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#00d0ff"),
        transparent: true,
        opacity: 0.42,
      }),
    []
  );

  useEffect(() => {
    if (!group.current) return;

    // Clear existing children
    while (group.current.children.length) {
      group.current.remove(group.current.children[0]);
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;

    const COUNT = prefersReduced ? 0 : isMobile ? 16 : 30;

    for (let i = 0; i < COUNT; i++) {
      const line = new THREE.Line(geometry, material);
      line.rotation.x = Math.random() * Math.PI;
      line.rotation.y = Math.random() * Math.PI;
      line.rotation.z = Math.random() * Math.PI;
      group.current.add(line);
    }

    return () => {
      if (!group.current) return;
      while (group.current.children.length) {
        group.current.remove(group.current.children[0]);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    group.current.rotation.z = clock.getElapsedTime() * 0.03;
    group.current.rotation.x = mouse.y * 0.35;
    group.current.rotation.y = mouse.x * 0.35;
  });

  return <group ref={group} />;
}

export default function HeroBackground({ eventSource }: Props) {
  const [sourceEl, setSourceEl] = useState<HTMLElement | null>(null);
  const [dpr, setDpr] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    setSourceEl(eventSource.current ?? null);
  }, [eventSource]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDpr([1, Math.min(2, window.devicePixelRatio || 1)]);
    }
  }, []);

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={dpr}
        eventSource={sourceEl ?? undefined}
        eventPrefix="client"
      >
        <color attach="background" args={["#0b0f14"]} />
        <WebField />
      </Canvas>
    </div>
  );
}
