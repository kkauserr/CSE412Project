import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-green-100 py-4 text-center text-gray-700">
      <p className="text-sm">
        © 2025 PetAdopt | Built by <span className="font-semibold">Amogh Shetty</span> |  
        <Link 
          href="https://github.com/shettyamoghh/pet-adoption" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-700 font-semibold hover:underline ml-1"
        >
          GitHub
        </Link>
      </p>
    </footer>
  );
}