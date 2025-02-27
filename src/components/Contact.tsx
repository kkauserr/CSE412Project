import { Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section className="w-full bg-white py-16 px-6 text-center">
      <h2 className="text-4xl font-bold text-green-700">Contact Us</h2>
      <p className="mt-4 text-lg text-gray-700">Need help? Reach out to us.</p>
      <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="flex items-center gap-3 text-lg text-gray-700">
          <Mail className="w-6 h-6 text-green-700" />
          support@petadopt.com
        </div>
        <div className="flex items-center gap-3 text-lg text-gray-700">
          <Phone className="w-6 h-6 text-green-700" />
          (123) 456-7890
        </div>
      </div>
    </section>
  );
}