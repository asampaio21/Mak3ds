import React, { Suspense, useState, useCallback } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Float, Html } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { Rotate3D, Cpu, Image as ImageIcon, Upload } from 'lucide-react';
import * as THREE from 'three';
import { useDropzone } from 'react-dropzone';

// Augment JSX namespace to recognize R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      meshStandardMaterial: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      torusKnotGeometry: any;
      fog: any;
    }
  }
}

const Model = ({ url }: { url: string }) => {
  const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry;
  if(geometry) { geometry.center(); geometry.computeVertexNormals(); }
  return <mesh geometry={geometry} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow><meshStandardMaterial color="#06b6d4" roughness={0.5} metalness={0.8} /></mesh>;
};

const ImagePlate = ({ imgUrl }: { imgUrl: string }) => {
    const texture = useLoader(THREE.TextureLoader, imgUrl);
    return <Float speed={2}><mesh><planeGeometry args={[4, 4]} /><meshBasicMaterial map={texture} transparent opacity={0.9} side={THREE.DoubleSide} /></mesh></Float>;
};

const Hologram = ({ isAnalyzing }: { isAnalyzing: boolean }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  useFrame((state, delta) => { if(meshRef.current) { meshRef.current.rotation.x += delta * 0.2; meshRef.current.rotation.y += delta; } });
  return <Float><mesh ref={meshRef}><torusKnotGeometry args={[1, 0.3, 128, 16]} /><meshStandardMaterial color={isAnalyzing ? "#f97316" : "#06b6d4"} emissive={isAnalyzing ? "#c2410c" : "#0891b2"} wireframe transparent opacity={0.8} /></mesh></Float>;
};

export const ModelViewer = ({ fileUrl, imageUrl, isAnalyzing = false }: { fileUrl?: string|null, imageUrl?: string|null, isAnalyzing?: boolean }) => {
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => { if(acceptedFiles[0]) setLocalFileUrl(URL.createObjectURL(acceptedFiles[0])); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'model/stl': ['.stl']}, maxFiles: 1, noClick: true });
  const activeUrl = localFileUrl || fileUrl;

  return (
    <div {...getRootProps()} className="w-full h-[300px] md:h-[400px] bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl group">
      <input {...getInputProps()} />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <Suspense fallback={<Html center><div className="text-cyan-500 animate-pulse">LOADING...</div></Html>}>
          <Stage environment="city" intensity={0.5}>
             {activeUrl ? <Model url={activeUrl} /> : imageUrl ? <ImagePlate imgUrl={imageUrl} /> : <Hologram isAnalyzing={isAnalyzing} />}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate={!isAnalyzing && !activeUrl} />
      </Canvas>
      {isDragActive && <div className="absolute inset-0 bg-cyan-900/80 z-50 flex items-center justify-center border-2 border-dashed border-cyan-400 m-2 rounded-2xl text-white font-bold"><Upload className="w-8 h-8 mr-2"/> DROP STL</div>}
      <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-1.5 rounded-full text-xs text-cyan-400 border border-cyan-500/30 flex items-center gap-2 pointer-events-none">
         {activeUrl ? <><Rotate3D className="w-3 h-3" /> INTERACTIVE</> : <><Cpu className="w-3 h-3" /> HOLOGRAM</>}
      </div>
    </div>
  );
};