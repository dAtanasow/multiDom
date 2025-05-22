import {
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function Advantages() {
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Защо да изберете нас?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center">
          <CheckCircleIcon className="w-16 h-16 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            100% Качество на продуктите
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Всяко едно от нашите предложения преминава през стриктен контрол на
            качеството.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <TruckIcon className="w-16 h-16 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            Бърза доставка в цялата страна
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Получавате поръчката си в рамките на 24-48 часа в цялата страна.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <ShieldCheckIcon className="w-16 h-16 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            Сигурно Пазаруване
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Вашите данни са защитени с най-съвременните технологии за сигурност.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <ArrowPathIcon className="w-16 h-16 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            Връщане в срок от 14 дни
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Можете да върнете продуктите в рамките на 14 дни, ако не сте
            доволни.
          </p>
        </div>
      </div>
    </section>
  );
}
