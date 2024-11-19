import React from 'react';
import { 
  CompassOutlined, 
  EnvironmentOutlined, 
  CarOutlined, 
  FileTextOutlined,
  RightOutlined
} from '@ant-design/icons';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    {
      title: "Điểm đến lý tưởng",
      icon: <CompassOutlined />,
      description: "Chọn nơi bạn muốn đến"
    },
    {
      title: "Chọn địa điểm",
      icon: <EnvironmentOutlined />,
      description: "Khám phá các điểm tham quan"
    },
    {
      title: "Tạo chuyến đi",
      icon: <CarOutlined />,
      description: "Lên kế hoạch chi tiết"
    },
    {
      title: "Hoàn thành",
      icon: <FileTextOutlined />,
      description: "Xem lại lịch trình"
    }
  ];

  return (
    <div className="w-full bg-white shadow-sm py-6 mb-8 border-b">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle with Number */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300 relative z-10
                    ${
                      index + 1 < currentStep 
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : index + 1 === currentStep
                        ? 'bg-white border-indigo-600 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {step.icon}
                </div>

                {/* Step Content */}
                <div className={`
                  mt-3 text-center relative
                  ${index + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-400'}
                `}>
                  <div className="font-medium mb-1">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-[22px] -right-[25%] transform translate-x-1/2
                    ${index + 1 < currentStep ? 'text-indigo-500' : 'text-gray-300'}
                  `}>
                    <div className="flex items-center">
                      <div className="w-8 h-[2px] bg-current" />
                      <RightOutlined className="text-lg" />
                    </div>
                  </div>
                )}

                {/* Step Number Badge */}
                <div className={`
                  absolute -top-4 -right-2 
                  w-6 h-6 rounded-full 
                  flex items-center justify-center 
                  text-xs font-bold
                  ${
                    index + 1 <= currentStep 
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;