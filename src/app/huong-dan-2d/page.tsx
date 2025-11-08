'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Monitor, 
  Server, 
  ArrowRight,
  Code,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const socketSteps = [
  {
    id: 1,
    name: 'socket()',
    description: 'Tạo socket endpoint cho giao tiếp mạng',
    serverCode: `int server_fd = socket(AF_INET, SOCK_STREAM, 0);`,
    clientCode: `int client_fd = socket(AF_INET, SOCK_STREAM, 0);`,
    explanation: 'Hàm socket() tạo ra một file descriptor mới để giao tiếp mạng. AF_INET chỉ định IPv4, SOCK_STREAM chỉ định TCP.'
  },
  {
    id: 2,
    name: 'bind()',
    description: 'Gán địa chỉ IP và port cho server socket',
    serverCode: `struct sockaddr_in address;
address.sin_family = AF_INET;
address.sin_addr.s_addr = INADDR_ANY;
address.sin_port = htons(8080);
bind(server_fd, (struct sockaddr*)&address, sizeof(address));`,
    clientCode: `// Client không cần bind()
// Hệ thống tự động gán port`,
    explanation: 'Server cần bind() để gán địa chỉ cụ thể. Client thường không cần bind() vì hệ thống tự động gán port.'
  },
  {
    id: 3,
    name: 'listen()',
    description: 'Server lắng nghe kết nối đến',
    serverCode: `listen(server_fd, 3);`,
    clientCode: `// Client không cần listen()`,
    explanation: 'listen() đặt server socket vào chế độ passive, sẵn sàng nhận kết nối. Tham số thứ 2 là số kết nối tối đa trong hàng đợi.'
  },
  {
    id: 4,
    name: 'connect()',
    description: 'Client kết nối đến server',
    serverCode: `// Server đợi kết nối`,
    clientCode: `struct sockaddr_in serv_addr;
serv_addr.sin_family = AF_INET;
serv_addr.sin_port = htons(8080);
inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr);
connect(client_fd, (struct sockaddr*)&serv_addr, sizeof(serv_addr));`,
    explanation: 'Client sử dụng connect() để thiết lập kết nối TCP với server. Cần chỉ định địa chỉ IP và port của server.'
  },
  {
    id: 5,
    name: 'accept()',
    description: 'Server chấp nhận kết nối từ client',
    serverCode: `int new_socket = accept(server_fd, NULL, NULL);`,
    clientCode: `// Kết nối đã được thiết lập`,
    explanation: 'accept() trả về socket descriptor mới để giao tiếp với client cụ thể. Server socket gốc vẫn lắng nghe kết nối khác.'
  },
  {
    id: 6,
    name: 'send/recv',
    description: 'Trao đổi dữ liệu giữa client và server',
    serverCode: `char buffer[1024] = {0};
recv(new_socket, buffer, 1024, 0);
send(new_socket, "Hello from server", 17, 0);`,
    clientCode: `send(client_fd, "Hello from client", 17, 0);
char buffer[1024] = {0};
recv(client_fd, buffer, 1024, 0);`,
    explanation: 'Sau khi kết nối được thiết lập, client và server có thể trao đổi dữ liệu bằng send() và recv().'
  },
  {
    id: 7,
    name: 'close()',
    description: 'Đóng kết nối và giải phóng tài nguyên',
    serverCode: `close(new_socket);
close(server_fd);`,
    clientCode: `close(client_fd);`,
    explanation: 'Luôn đóng socket sau khi sử dụng để giải phóng tài nguyên hệ thống và tránh memory leak.'
  }
];

export default function Guide2DPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= socketSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const currentStepData = socketSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Hướng dẫn Socket Programming 2D
          </h1>
          <p className="text-gray-400 text-lg">
            Mô phỏng trực quan các bước trong Socket Programming
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlay}
                className={`px-6 py-3 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-medium transition-colors flex items-center space-x-2`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Đặt lại</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCode(!showCode)}
                className={`px-4 py-2 ${showCode ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2`}
              >
                <Code className="w-4 h-4" />
                <span>Code</span>
              </button>
              <span className="text-gray-400">
                Bước {currentStep + 1} / {socketSteps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Animation Area */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Monitor className="w-5 h-5 text-blue-400 mr-2" />
              Mô phỏng Socket Programming
            </h2>
            
            <div className="relative h-96 bg-gray-900 rounded-lg p-6 overflow-hidden">
              {/* Server */}
              <motion.div
                className="absolute left-8 top-8"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: currentStep >= 0 ? 1 : 0.8,
                  opacity: currentStep >= 0 ? 1 : 0.5
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">Server</p>
                  <p className="text-gray-400 text-xs">Port 8080</p>
                </div>
              </motion.div>

              {/* Client */}
              <motion.div
                className="absolute right-8 top-8"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: currentStep >= 0 ? 1 : 0.8,
                  opacity: currentStep >= 0 ? 1 : 0.5
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                    <Monitor className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">Client</p>
                  <p className="text-gray-400 text-xs">Dynamic Port</p>
                </div>
              </motion.div>

              {/* Connection Line */}
              <AnimatePresence>
                {currentStep >= 4 && (
                  <motion.div
                    className="absolute top-16 left-28 right-28 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 1 }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </AnimatePresence>

              {/* Data Flow Animation */}
              <AnimatePresence>
                {currentStep >= 5 && (
                  <>
                    <motion.div
                      className="absolute top-14 w-4 h-4 bg-yellow-400 rounded-full"
                      initial={{ left: '7rem' }}
                      animate={{ left: 'calc(100% - 9rem)' }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }}
                    />
                    <motion.div
                      className="absolute top-18 w-4 h-4 bg-purple-400 rounded-full"
                      initial={{ right: '7rem' }}
                      animate={{ right: 'calc(100% - 9rem)' }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 1
                      }}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Step Indicator */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-800/80 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {currentStepData.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Display */}
          {showCode && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Code className="w-5 h-5 text-green-400 mr-2" />
                Code Example
              </h2>
              
              <div className="space-y-4">
                {/* Server Code */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Server Code:</h3>
                  <div className="code-block p-4">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{currentStepData.serverCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Client Code */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Client Code:</h3>
                  <div className="code-block p-4">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{currentStepData.clientCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Các bước Socket Programming</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStepChange(Math.min(socketSteps.length - 1, currentStep + 1))}
                disabled={currentStep === socketSteps.length - 1}
                className="p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {socketSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepChange(index)}
                className={`
                  p-3 rounded-lg text-left transition-colors border
                  ${index === currentStep 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : index < currentStep
                    ? 'bg-green-600/20 border-green-500 text-green-300'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                <div className="font-medium text-sm">{step.name}</div>
                <div className="text-xs opacity-80 mt-1">{step.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Giải thích chi tiết</h3>
              <p className="text-blue-200">{currentStepData.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
