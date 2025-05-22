export default function EditButton({ onEdit }) {
    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={onEdit}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 text-sm shadow-sm"
            >
                Редактирай
            </button>
        </div>
    );
}