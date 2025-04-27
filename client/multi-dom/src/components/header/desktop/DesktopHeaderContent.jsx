import DesktopNav from "../../navigation/desktop/Navigation";

export default function DesktopHeaderContent({ setActivePanel }) {
  return (
    <div className="hidden md:block bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-shrink-0">
          <img src="../мултиДом-logo.jpeg" alt="МултиДом" className="w-40" />
        </div>

        <div className="flex flex-col items-center flex-grow px-4">
          <div className="flex w-full max-w-md">
            <input
              type="text"
              placeholder="Търси продукт..."
              className="flex-grow px-4 py-2 border rounded-l-xl border-gray-300 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-xl hover:bg-blue-700 transition">
              Търси
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Безплатна доставка за поръчки над 70 лв.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setActivePanel((prev) => (prev === "login" ? null : "login"))
            }
            className="cursor-pointer px-3 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
          >
            <svg
              className="w-6 h-6 text-blue-600 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m11.25 11.25v-1.5a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25v1.5M12 12a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </button>

          <button className="cursor-pointer px-3 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-blue-600 group-hover:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386a.75.75 0 0 1 .728.573L5.82 9.75h12.41a.75.75 0 0 1 .73.928l-1.2 5a.75.75 0 0 1-.73.572H8.032a.75.75 0 0 1-.728-.572L5.227 4.5H3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 16.5h.008v.008H16.5v-.008Zm-9 0h.008v.008H7.5v-.008Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <DesktopNav />
      </div>
    </div>
  );
}
