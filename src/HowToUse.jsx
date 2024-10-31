import React from "react";
import { Camera, Search, BookOpen, AlertCircle } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: <Camera className="w-8 h-8 text-green-600" />,
      title: "Capture or Upload",
      description:
        "Take a photo of the plant using your camera or upload an existing image from your device.",
    },
    {
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: "AI Analysis",
      description:
        "Our AI system will analyze the image to identify the Ayurvedic plant and its characteristics.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Learn",
      description:
        "Get detailed information about the plant's medicinal properties and traditional uses.",
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-green-600" />,
      title: "Verify",
      description:
        "Always verify the identification with a qualified Ayurvedic practitioner before use.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          How to Use PranaBot
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{step.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
