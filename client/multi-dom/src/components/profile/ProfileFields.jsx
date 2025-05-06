export function ProfileFields({ values, changeHandler, editMode }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Field label="Име" value={values.firstName} name="firstName" editMode={editMode} changeHandler={changeHandler} />
            <Field label="Фамилия" value={values.lastName} name="lastName" editMode={editMode} changeHandler={changeHandler} />
            <Field label="Имейл" value={values.email} name="email" editMode={editMode} changeHandler={changeHandler} />
            <Field label="Телефон" value={values.phone} name="phone" editMode={editMode} changeHandler={changeHandler} />
        </div>
    );
}

function Field({ label, value, name, editMode, changeHandler }) {
    return (
        <div className="bg-gray-100 rounded-xl p-4 shadow-sm flex flex-col">
            <span className="text-sm text-gray-500">{label}</span>
            {editMode ? (
                <input
                    name={name}
                    value={value}
                    onChange={changeHandler}
                    placeholder={`Въведи ${label.toLowerCase()}`}
                    className="mt-2 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    autoComplete="off"
                />
            ) : (
                <span className="text-lg font-semibold text-gray-800">
                    {name === "phone" ? `+${value}` : value}
                </span>
            )}
        </div>
    );
}
