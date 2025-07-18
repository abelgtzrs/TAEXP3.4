import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// This is the component that renders the actual Earth mesh.
function EarthSphere() {
  // `useRef` gives us a reference to the mesh object in the 3D scene.
  const meshRef = useRef();

  // `useLoader` is a hook from R3F that simplifies loading assets like textures.
  // Make sure you have a world map texture in your /public folder.
  const texture = useLoader(THREE.TextureLoader, "/earth-texture.jpg"); // UPDATE PATH if needed

  // `useFrame` is a hook that runs on every single rendered frame (60fps).
  // This is where we create animations.
  useFrame(() => {
    // Slowly rotate the globe on its Y-axis.
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* The shape of our 3D object */}
      <sphereGeometry args={[2, 32, 32]} />
      {/* The material (skin) of our object, using the loaded texture */}
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// This is the main widget component that sets up the 3D scene.
const GlobeWidget = () => {
  return (
    <div className="w-full h-full bg-black rounded-lg">
      {/* The Canvas component is the entry point for a 3D scene. */}
      <Canvas>
        {/* Ambient light illuminates all objects in the scene equally. */}
        <ambientLight intensity={1.5} />
        {/* Point light acts like a light bulb, creating highlights. */}
        <pointLight position={[10, 10, 10]} />

        {/* The Stars component from 'drei' adds a beautiful starfield background. */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <EarthSphere />

        {/* OrbitControls allows the user to zoom and rotate the globe with their mouse. */}
        <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default GlobeWidget;
