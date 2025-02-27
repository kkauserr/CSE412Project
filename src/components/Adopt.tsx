import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Search, ClipboardCheck, Home } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-12 h-12 text-green-700" />,
    title: "Browse Pets",
    description: "Search for available pets based on breed, size, and location.",
  },
  {
    icon: <ClipboardCheck className="w-12 h-12 text-green-700" />,
    title: "Fill Application",
    description: "Fill out a simple adoption application and get approved.",
  },
  {
    icon: <PawPrint className="w-12 h-12 text-green-700" />,
    title: "Meet Your Pet",
    description: "Schedule a visit to meet and interact with your future pet.",
  },
  {
    icon: <Home className="w-12 h-12 text-green-700" />,
    title: "Welcome Home!",
    description: "Finalize the adoption and welcome your new pet home.",
  },
];

export default function Adopt() {
  return (
    <section className="w-full bg-green-50 py-16 px-6 text-center">
      <h2 className="text-4xl font-bold text-green-700">Our Adoption Process</h2>
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="w-64 h-74 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col justify-between p-6"
          >
            <CardHeader className="flex flex-col items-center mt-4">
              {step.icon}
              <CardTitle className="text-xl font-semibold mt-5">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center">
              <p className="text-gray-700 text-center">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}