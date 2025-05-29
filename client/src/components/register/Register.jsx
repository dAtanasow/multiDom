import { useForm } from "../../hooks/useForm";
import { useRegister } from "../../hooks/useAuth";
import { useAuthContext } from "../../context/AuthContext";
import CustomPhoneInput from "../CustomPhoneInput";
import { useState } from "react";

export default function Register({ onClose, onLoginClick, visible }) {
  const { changeAuthState } = useAuthContext();
  const { register, loading: registerLoading } = useRegister();
  const [phoneError, setPhoneError] = useState(false);

  const { values, changeHandler, submitHandler, pending, setValues } = useForm(
    {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    async (formData) => {
      const result = await register(formData);

      changeAuthState({
        user: result.user,
        accessToken: result.accessToken,
      });

      onClose();
    })

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`bg-white w-full md:w-1/2 h-screen p-8 shadow-lg transform transition-all duration-300 
          ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Регистрация</h2>
          <button
            onClick={onClose}
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
          <CustomPhoneInput
            value={values.phone}
            onChange={(phone) => setValues(prev => ({ ...prev, phone }))}
            error={phoneError}
            setError={setPhoneError}
          />
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
          <input
            type="password"
            name="rePassword"
            value={values.rePassword}
            onChange={changeHandler}
            placeholder="Повторете паролата"
            className="border p-2 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={pending || registerLoading}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {pending || registerLoading ? "Моля изчакайте..." : "Регистрация"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Вече имаш акаунт?{" "}
          <button
            onClick={onLoginClick}
            className="text-blue-600 hover:underline"
          >
            Вход
          </button>
        </p>
      </div>
    </div>
  );
}