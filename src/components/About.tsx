export default function About() {
  return (
    <section id="about" className="w-full bg-white py-16 px-6 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-6">
        {/* Left Side: Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-green-700">About PetAdopt</h2>
          <p className="mt-6 text-lg text-gray-700">
            PetAdopt is a platform that connects loving pets with caring owners. 
            Our mission is to make pet adoption easier, faster, and more accessible to everyone.
            Find your ideal pet, connect with shelters, and bring home a new companion today.
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2 flex justify-center">
          <img src="/dog.jpg" alt="Adorable dog" className="rounded-2xl shadow-lg w-full max-w-md" />
        </div>
      </div>
    </section>
  );
}