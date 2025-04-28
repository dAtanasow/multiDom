import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import useRegister from "../hooks/useRegister";
import useLogin from "../hooks/useLogin";

const countries = [
  { name: "България", code: "+359" },
  { name: "Германия", code: "+49" },
  { name: "Франция", code: "+33" },
  { name: "САЩ", code: "+1" },
  { name: "Великобритания", code: "+44" },
];

export default function Register({ onClose, onLoginClick }) {
  const [visible, setVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { register: registerApi, loading: registerLoading } = useRegister();
  const { login, loading: loginLoading } = useLogin();

  const { values, changeHandler, submitHandler, pending } = useForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    async (formData) => {
      const fullPhone = selectedCountry.code + phoneNumber;

      const result = await registerApi({
        ...formData,
        phone: fullPhone,
      });

      changeAuthState({
        user: result.user,
        accessToken: result.accessToken,
      });

      setVisible(false);
      setTimeout(onClose, 300);
    }
  );

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`bg-white w-full md:w-1/2 h-screen p-8 shadow-lg transform transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Регистрация</h2>
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
        <form className="flex flex-col space-y-4" onSubmit={submitHandler}>
          <input
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={changeHandler}
            placeholder="Име"
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={changeHandler}
            placeholder="Фамилия"
            className="border p-2 rounded-lg"
            required
          />
          <div className="flex space-x-2">
            <select
              className="border p-2 rounded-lg w-1/3"
              value={selectedCountry.code}
              onChange={(e) =>
                setSelectedCountry(
                  countries.find((c) => c.code === e.target.value)
                )
              }
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <div className="flex items-center border p-2 rounded-lg w-2/3">
              <span className="text-gray-500 mr-2">{selectedCountry.code}</span>
              <input
                type="tel"
                className="outline-none w-full"
                placeholder="Телефонен номер"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder="Имейл"
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
            placeholder="Парола"
            className="border p-2 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={pending || registerLoading || loginLoading}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {pending || registerLoading || loginLoading ? "Моля изчакайте..." : "Регистрация"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Вече имаш акаунт?{" "}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onLoginClick, 300);
            }}
            className="text-blue-600 hover:underline"
          >
            Вход
          </button>
        </p>
      </div>
    </div>
  );
}
