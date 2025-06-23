export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:mt-20">
      <h1 className="text-3xl font-bold mb-8">Политика за поверителност</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Събиране на лични данни
        </h2>
        <p className="text-gray-700">
          Когато използвате нашия сайт, ние можем да събираме следните лични
          данни: име и фамилия, телефонен номер, имейл адрес, адрес за доставка
          и данни за фактуриране.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. Използване на личните данни
        </h2>
        <p className="text-gray-700">
          Ние използваме вашите лични данни за обработване на вашите поръчки, за
          изпращане на информация относно вашите поръчки и за комуникация
          относно продукти, промоции или поддръжка.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Споделяне на данни</h2>
        <p className="text-gray-700">
          Ние не продаваме, не наемаме и не споделяме вашите лични данни с трети
          страни, освен когато е необходимо за изпълнение на доставката или
          когато това се изисква по закон.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          4. Защита на личните данни
        </h2>
        <p className="text-gray-700">
          Вашите лични данни са защитени чрез адекватни технически и
          организационни мерки за сигурност.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          5. Права на потребителите
        </h2>
        <p className="text-gray-700">
          Имате право да поискате достъп до вашите лични данни, да коригирате
          неточности, да изискате изтриване или да оттеглите съгласието си за
          обработка. Свържете се с нас на:{" "}
          <a
            href="mailto:info@multidom.bg"
            className="text-blue-500 hover:underline"
          >
            info@multidom.bg
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Бисквитки (Cookies)</h2>
        <p className="text-gray-700">
          Нашият сайт използва "бисквитки" за подобряване на потребителското
          изживяване. Можете да управлявате настройките на бисквитките чрез
          вашия браузър.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          7. Промени в Политиката за поверителност
        </h2>
        <p className="text-gray-700">
          МултиДом си запазва правото да актуализира тази политика. Всички
          промени ще бъдат публикувани на тази страница.
        </p>
      </section>

      <div className="text-center text-gray-500 text-sm mt-12">
        Последна актуализация: {new Date().toLocaleDateString("bg-BG")}
      </div>
    </div>
  );
}
