import { useEffect, useState } from "react";

export default function Login({ onClose, onRegisterClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`bg-white w-full md:w-1/2 h-screen p-8 shadow-lg transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Вход</h2>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Потребителско име"
            className="border p-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Парола"
            className="border p-2 rounded-lg"
          />
          <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Вход
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Нямаш акаунт?{" "}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onRegisterClick, 300);
            }}
            className="text-blue-600 hover:underline"
          >
            Регистрация
          </button>
        </p>
      </div>
    </div>
  );
}
