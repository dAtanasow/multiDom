export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and description */}
        <div>
          <img
            src="/icons/мултиДом-logo.jpeg"
            alt="МултиДом"
            className="w-32 mb-4"
          />
          <p className="text-sm">
            Всичко за чистия и уютен дом - перилни и почистващи препарати,
            козметика и много други.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold mb-2">Навигация</h3>
          <a href="/about" className="hover:text-white">
            За нас
          </a>
          <a href="/contact" className="hover:text-white">
            Контакти
          </a>
          <a href="/privacy" className="hover:text-white">
            Политика за поверителност
          </a>
          <a href="/terms" className="hover:text-white">
            Общи условия
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold mb-2">Контакти</h3>
          <p>
            Телефон:{" "}
            <a href="tel:+359888123456" className="hover:text-white">
              +359 89 873 3319
            </a>
          </p>
          <p>
            Имейл:{" "}
            <a href="mailto:info@multidom.bg" className="hover:text-white">
              info@multidom.bg
            </a>
          </p>
          <p>Адрес: кв. Овча купел, ул. "Войводина Могила" 42, 1618 София</p>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold mb-2">Абонирайте се</h3>
          <p className="text-sm">
            Получавайте новини и промоции директно на вашия имейл.
          </p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Вашият имейл"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Абонирай се
            </button>
          </form>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold mb-2">Последвайте ни</h3>
          <div className="flex space-x-4">
            <a
              target="blank"
              href="https://www.facebook.com/profile.php?id=61568836761370#"
              className="hover:text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.878v-6.987H7.898v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.464h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>
            <a
              target="blank"
              href="https://www.facebook.com/profile.php?id=61568836761370#"
              className="hover:text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm8.5 1.5c2.347 0 4.25 1.903 4.25 4.25v8.5c0 2.347-1.903 4.25-4.25 4.25h-8.5c-2.347 0-4.25-1.903-4.25-4.25v-8.5c0-2.347 1.903-4.25 4.25-4.25h8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.75a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} МултиДом. Всички права запазени.
      </div>
    </footer>
  );
}
