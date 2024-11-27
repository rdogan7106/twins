import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Face3DViewer = ({ face3DData }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pointsRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(face3DData) || face3DData.length === 0 || !face3DData.every(point => point.length === 3)) {
      console.error("Unvalid face3DData:", face3DData);
      return;
    }

    const scene = sceneRef.current;

    if (pointsRef.current) {
      scene.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      pointsRef.current.material.dispose();
      pointsRef.current = null;
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(face3DData.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.01 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    pointsRef.current = points;
  }, [face3DData]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '400px', height: '400px' }} />;
};

export default Face3DViewer;