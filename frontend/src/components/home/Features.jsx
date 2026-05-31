import React from "react";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Local Expertise",
      description: "Our team knows every destination inside and out",
      icon: "🌍",
    },
    {
      id: 2,
      title: "Curated Experiences",
      description: "We've hand-picked every property for quality and value",
      icon: "✨",
    },
    {
      id: 3,
      title: "Expert Support",
      description: "24/7 customer support to ensure your perfect stay",
      icon: "💬",
    },
    {
      id: 4,
      title: "Best Prices",
      description: "Guaranteed lowest prices for luxury accommodations",
      icon: "💰",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;