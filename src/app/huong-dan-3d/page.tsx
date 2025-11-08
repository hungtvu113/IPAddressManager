'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Box as BoxIcon, 
  Settings,
  Info,
  Maximize
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animated Packet Component
function AnimatedPacket({
  startPos,
  endPos,
  color,
  isActive
}: {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color: string;
  isActive: boolean;
}) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const time = state.clock.getElapsedTime();
      const progress = (Math.sin(time * 2) + 1) / 2; // Oscillate between 0 and 1

      meshRef.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * progress;
      meshRef.current.position.y = startPos[1] + (endPos[1] - startPos[1]) * progress;
      meshRef.current.position.z = startPos[2] + (endPos[2] - startPos[2]) * progress;

      // Add some floating animation
      meshRef.current.position.y += Math.sin(time * 4) * 0.1;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} position={startPos}>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// 3D Scene Component
function NetworkScene({ currentStep, isPlaying }: { currentStep: number; isPlaying: boolean }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Server */}
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 2, 1]} />
          <meshStandardMaterial
            color={currentStep >= 1 ? "#3b82f6" : "#1e293b"}
            emissive={currentStep >= 1 ? "#1e40af" : "#000000"}
            emissiveIntensity={currentStep >= 1 ? 0.2 : 0}
          />
        </mesh>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          SERVER
        </Text>
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.2}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {currentStep >= 2 ? "LISTENING:8080" : "Port 8080"}
        </Text>
        {currentStep >= 1 && (
          <Text
            position={[0, -2.1, 0]}
            fontSize={0.15}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            {currentStep === 1 ? "socket() ✓" :
             currentStep === 2 ? "bind() ✓" :
             currentStep >= 3 ? "listen() ✓" : ""}
          </Text>
        )}
      </group>

      {/* Client */}
      <group position={[4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.5, 0.8]} />
          <meshStandardMaterial
            color={currentStep >= 3 ? "#10b981" : "#1e293b"}
            emissive={currentStep >= 3 ? "#059669" : "#000000"}
            emissiveIntensity={currentStep >= 3 ? 0.2 : 0}
          />
        </mesh>
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          CLIENT
        </Text>
        {currentStep >= 3 && (
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.15}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            {currentStep === 3 ? "connect() ..." :
             currentStep >= 4 ? "connected ✓" : ""}
          </Text>
        )}
      </group>

      {/* Connection Line */}
      {currentStep >= 4 && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[6, 0.1, 0.1]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={currentStep >= 4 ? 0.4 : 0.1}
            />
          </mesh>
          {/* Connection indicators */}
          <mesh position={[-2.8, 0.5, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[2.8, 0.5, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* Data Packets */}
      {currentStep >= 5 && (
        <>
          <AnimatedPacket
            startPos={[-3, 0.5, 0]}
            endPos={[3, 0.5, 0]}
            color="#f59e0b"
            isActive={isPlaying}
          />
          <AnimatedPacket
            startPos={[3, 0.5, 0]}
            endPos={[-3, 0.5, 0]}
            color="#8b5cf6"
            isActive={isPlaying}
          />
        </>
      )}

      {/* Step Indicators */}
      <group position={[0, 2.5, 0]}>
        <Text
          fontSize={0.4}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          {getStepName(currentStep)}
        </Text>
      </group>

      {/* Basic lighting instead of Environment */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
    </>
  );
}

function getStepName(step: number): string {
  const steps = [
    'socket()',
    'bind()',
    'listen()',
    'connect()',
    'accept()',
    'send/recv',
    'close()'
  ];
  return steps[step] || 'socket()';
}



export default function Guide3DPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [cameraMode, setCameraMode] = useState('orbit');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // Change step every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const steps = [
    {
      name: 'socket()',
      description: 'Tạo socket endpoint cho giao tiếp mạng',
      details: 'Khởi tạo socket descriptor cho cả server và client'
    },
    {
      name: 'bind()',
      description: 'Gán địa chỉ IP và port cho server',
      details: 'Server bind vào địa chỉ cụ thể để client có thể tìm thấy'
    },
    {
      name: 'listen()',
      description: 'Server chuyển sang chế độ lắng nghe',
      details: 'Đặt server socket vào passive mode, sẵn sàng nhận kết nối'
    },
    {
      name: 'connect()',
      description: 'Client khởi tạo kết nối đến server',
      details: 'Client gửi yêu cầu kết nối TCP đến server'
    },
    {
      name: 'accept()',
      description: 'Server chấp nhận kết nối từ client',
      details: 'Tạo socket mới để giao tiếp với client cụ thể'
    },
    {
      name: 'send/recv',
      description: 'Trao đổi dữ liệu qua kết nối',
      details: 'Client và server có thể gửi/nhận dữ liệu qua lại'
    },
    {
      name: 'close()',
      description: 'Đóng kết nối và giải phóng tài nguyên',
      details: 'Kết thúc phiên giao tiếp và dọn dẹp tài nguyên'
    }
  ];

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      // If at the end, reset to beginning
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Hướng dẫn Socket Programming 3D
          </h1>
          <p className="text-gray-400 text-lg">
            Trải nghiệm học tập 3D tương tác với mô hình server-client
          </p>
        </div>

        {/* 3D Scene */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BoxIcon className="w-5 h-5 text-purple-400 mr-2" />
              Mô hình 3D Socket Programming
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className={`p-2 ${showControls ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white rounded-lg transition-colors`}
                title="Toggle Controls"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
              <Suspense fallback={null}>
                <NetworkScene currentStep={currentStep} isPlaying={isPlaying} />
                {showControls && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Playback Controls */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Điều khiển</h3>
            <div className="space-y-3">
              <button
                onClick={handlePlay}
                className={`w-full px-4 py-3 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          {/* Step Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Bước hiện tại</h3>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-400">
                {steps[currentStep].name}
              </div>
              <div className="text-gray-300">
                {steps[currentStep].description}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                Bước {currentStep + 1} / {steps.length}
              </div>
              {isPlaying && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Đang phát tự động...</span>
                </div>
              )}
              {currentStep >= steps.length - 1 && !isPlaying && (
                <div className="text-blue-400 text-sm">
                  ✓ Hoàn thành tất cả các bước
                </div>
              )}
            </div>
          </div>

          {/* Camera Controls */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Góc nhìn</h3>
            <div className="space-y-2">
              <button
                onClick={() => setCameraMode('orbit')}
                className={`w-full px-3 py-2 ${cameraMode === 'orbit' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white rounded-lg text-sm transition-colors`}
              >
                Tự do
              </button>
              <button
                onClick={() => setCameraMode('top')}
                className={`w-full px-3 py-2 ${cameraMode === 'top' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white rounded-lg text-sm transition-colors`}
              >
                Từ trên
              </button>
              <button
                onClick={() => setCameraMode('side')}
                className={`w-full px-3 py-2 ${cameraMode === 'side' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-700 text-white rounded-lg text-sm transition-colors`}
              >
                Từ bên
              </button>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Điều hướng các bước</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step, index) => (
              <motion.button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`
                  p-4 rounded-lg text-left transition-all duration-300 border
                  ${index === currentStep 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
                    : index < currentStep
                    ? 'bg-green-600/20 border-green-500 text-green-300'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-bold text-sm mb-1">{step.name}</div>
                <div className="text-xs opacity-80">{step.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Chi tiết bước {currentStep + 1}</h3>
              <p className="text-purple-200 mb-4">{steps[currentStep].details}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Tương tác 3D:</h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-200">
                    <li>Kéo để xoay góc nhìn</li>
                    <li>Cuộn chuột để zoom</li>
                    <li>Nhấp chuột phải để di chuyển</li>
                    <li>Quan sát animation packet</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Mô hình 3D:</h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-200">
                    <li>Hộp xanh: Server</li>
                    <li>Hộp xanh lá: Client</li>
                    <li>Đường vàng: Kết nối TCP</li>
                    <li>Hình cầu: Data packets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
