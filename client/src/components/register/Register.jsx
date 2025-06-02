import { useForm } from "../../hooks/useForm";
import { useRegister } from "../../hooks/useAuth";
import CustomPhoneInput from "../CustomPhoneInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getRegisterValidators } from "../../utils/getRegisterValidators";

export default function Register({ onClose, onLoginClick, visible }) {
  const { register, loading: registerLoading } = useRegister();
  const [phoneError, setPhoneError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const { values, changeHandler, submitHandler, pending, setValues, errors } = useForm(
    {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    async (formData) => {
      await register(formData, onClose);
    }, getRegisterValidators()
  );

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
            className={`border p-2 rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          <input
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={changeHandler}
            placeholder="Фамилия"
            className={`border p-2 rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

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
            className={`border p-2 rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={changeHandler}
              placeholder="Парола"
              className={`border p-2 rounded-lg w-full pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-2 text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="relative">
            <input
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              value={values.rePassword}
              onChange={changeHandler}
              placeholder="Повторете паролата"
              className={`border p-2 rounded-lg w-full pr-10 ${errors.rePassword ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowRePassword(prev => !prev)}
              className="absolute right-2 top-2 text-gray-600"
              tabIndex={-1}
            >
              {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword}</p>}

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