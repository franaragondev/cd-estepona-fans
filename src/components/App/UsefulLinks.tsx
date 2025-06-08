"use client";

export default function UsefulLinks() {
  return (
    <section className="py-8 text-center">
      <div className="flex justify-center gap-8">
        <a
          href="https://facebook.com/cdesteponafans"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com/cdesteponafans"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-800"
        >
          Instagram
        </a>
        <a
          href="#"
          className="text-green-600 hover:text-green-800"
          onClick={(e) => e.preventDefault()}
        >
          Comprar entradas
        </a>
        <a
          href="#"
          className="text-red-600 hover:text-red-800"
          onClick={(e) => e.preventDefault()}
        >
          Tienda oficial
        </a>
      </div>
    </section>
  );
}
