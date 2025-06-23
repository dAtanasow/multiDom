export default function Terms() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 md:mt-20">
      {/* Sidebar Navigation */}
      <aside className="hidden md:block md:w-1/4 sticky top-20 self-start">
        <nav className="space-y-4">
          <a
            href="#section1"
            className="text-gray-700 hover:text-blue-600 block"
          >
            1. Приемане на условията
          </a>
          <a
            href="#section2"
            className="text-gray-700 hover:text-blue-600 block"
          >
            2. Регистрация
          </a>
          <a
            href="#section3"
            className="text-gray-700 hover:text-blue-600 block"
          >
            3. Поръчки и плащане
          </a>
          <a
            href="#section4"
            className="text-gray-700 hover:text-blue-600 block"
          >
            4. Доставка
          </a>
          <a
            href="#section5"
            className="text-gray-700 hover:text-blue-600 block"
          >
            5. Връщане на продукти
          </a>
          <a
            href="#section6"
            className="text-gray-700 hover:text-blue-600 block"
          >
            6. Гаранция
          </a>
          <a
            href="#section7"
            className="text-gray-700 hover:text-blue-600 block"
          >
            7. Ограничение на отговорност
          </a>
          <a
            href="#section8"
            className="text-gray-700 hover:text-blue-600 block"
          >
            8. Интелектуална собственост
          </a>
          <a
            href="#section9"
            className="text-gray-700 hover:text-blue-600 block"
          >
            9. Промени
          </a>
          <a
            href="#section10"
            className="text-gray-700 hover:text-blue-600 block"
          >
            10. Приложимо право
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        <section id="section1">
          <h1 className="text-3xl font-bold mb-8">Общи условия</h1>
          <h2 className="text-2xl font-semibold mb-4">
            1. Приемане на общите условия
          </h2>
          <p className="text-gray-700">
            С достъпа до уебсайта multidom.bg вие се съгласявате да спазвате
            настоящите Общи условия. Ако не сте съгласни, моля не използвайте
            сайта.
          </p>
        </section>

        <section id="section2">
          <h2 className="text-2xl font-semibold mb-4">2. Регистрация</h2>
          <p className="text-gray-700">
            За да направите поръчка, е възможно да се изисква регистрация. При
            регистрация вие предоставяте вярна, точна и актуална информация.
          </p>
        </section>

        <section id="section3">
          <h2 className="text-2xl font-semibold mb-4">3. Поръчки и плащане</h2>
          <p className="text-gray-700">
            Всички направени поръчки през сайта се считат за оферта за покупка.
            МултиДом си запазва правото да откаже поръчка в случай на грешки в
            цените, наличности или подозрения за злоупотреба. Плащанията могат
            да бъдат извършени чрез наложен платеж, банков превод или други
            налични методи.
          </p>
        </section>

        <section id="section4">
          <h2 className="text-2xl font-semibold mb-4">4. Доставка</h2>
          <p className="text-gray-700">
            Доставките се извършват на територията на България чрез куриерски
            фирми. Стандартният срок за доставка е от 1 до 3 работни дни.
            Разходите за доставка са указани при финализиране на поръчката.
          </p>
        </section>

        <section id="section5">
          <h2 className="text-2xl font-semibold mb-4">
            5. Връщане на продукти
          </h2>
          <p className="text-gray-700">
            Клиентите имат право да върнат продукт в срок от 14 дни от
            получаването му, без да посочват причина. Продуктът трябва да е в
            оригиналната си опаковка, без следи от употреба. Разходите по
            връщане са за сметка на клиента, освен ако продуктът е дефектен.
          </p>
        </section>

        <section id="section6">
          <h2 className="text-2xl font-semibold mb-4">6. Гаранция</h2>
          <p className="text-gray-700">
            Някои продукти могат да имат гаранция, която е описана в
            гаранционната карта или на етикета на продукта. При рекламация е
            необходимо да се предостави касова бележка или фактура.
          </p>
        </section>

        <section id="section7">
          <h2 className="text-2xl font-semibold mb-4">
            7. Ограничение на отговорност
          </h2>
          <p className="text-gray-700">
            МултиДом не носи отговорност за преки, косвени или последващи щети,
            възникнали при използване или невъзможност за използване на сайта.
            Сайтът може да съдържа връзки към външни сайтове, за чието
            съдържание МултиДом не носи отговорност.
          </p>
        </section>

        <section id="section8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Интелектуална собственост
          </h2>
          <p className="text-gray-700">
            Всички права върху съдържанието на сайта (текстове, изображения,
            лога) са собственост на МултиДом. Забранено е използването или
            разпространението на съдържанието без изрично писмено разрешение.
          </p>
        </section>

        <section id="section9">
          <h2 className="text-2xl font-semibold mb-4">
            9. Промени в Общите условия
          </h2>
          <p className="text-gray-700">
            МултиДом си запазва правото да променя настоящите условия по всяко
            време. Промените влизат в сила от момента на публикуването им на
            сайта.
          </p>
        </section>

        <section id="section10">
          <h2 className="text-2xl font-semibold mb-4">10. Приложимо право</h2>
          <p className="text-gray-700">
            За всички въпроси, неуредени в настоящите Общи условия, се прилага
            действащото българско законодателство.
          </p>
        </section>

        <div className="text-center text-gray-500 text-sm mt-12">
          Последна актуализация: {new Date().toLocaleDateString("bg-BG")}
        </div>
      </div>
    </div>
  );
}
