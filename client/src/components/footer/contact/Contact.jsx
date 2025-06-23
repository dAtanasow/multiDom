export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:mt-20">
      <h1 className="text-3xl font-bold mb-8">Контакти</h1>

      <section className="mb-8">
        <p className="text-gray-700 mb-4">Имате въпроси? Свържете се с нас:</p>
        <ul className="text-gray-700 space-y-2">
          <li>
            Телефон:{" "}
            <a
              href="tel:+359888123456"
              className="text-blue-500 hover:underline"
            >
              +359 888 123 456
            </a>
          </li>
          <li>
            Имейл:{" "}
            <a
              href="mailto:info@multidom.bg"
              className="text-blue-500 hover:underline"
            >
              info@multidom.bg
            </a>
          </li>
          <li>
            кв. Овча купел, ул. "Войводина Могила" 42, 1618 София, България
          </li>
        </ul>
      </section>

      <div className="text-center text-gray-500 text-sm mt-12">
        Очакваме вашето съобщение!
      </div>
    </div>
  );
}
