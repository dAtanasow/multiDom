import { useForm } from "../../hooks/useForm";
import { useLogin } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getLoginValidators } from "../../utils/validators";

export default function Login({ onClose, onRegisterClick, visible }) {
  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const { values, changeHandler, submitHandler, pending, errors } = useForm(
    {
      email: "",
      password: "",
    },
    async (formData) => {
      const result = await login(formData);
      if (result) {
        onClose();
        navigate("/");
      }
    },
    getLoginValidators()
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`bg-white w-full md:w-1/2 h-screen p-8 shadow-lg transform transition-all duration-300 
          ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Вход</h2>
          <button
            onClick={() => onClose()}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={submitHandler} noValidate>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder="Имейл"
            className={`border p-2 rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
            placeholder="Парола"
            className={`border p-2 rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button
            type="submit"
            disabled={pending || loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {pending || loading ? "Моля изчакайте..." : "Вход"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Нямаш акаунт?{" "}
          <button
            onClick={onRegisterClick}
            className="text-blue-600 hover:underline"
          >
            Регистрация
          </button>
        </p>
      </div>
    </div >
  );
}
