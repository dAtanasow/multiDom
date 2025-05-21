import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useMemo, useEffect, useState } from "react";

export default function OfficeListbox({ offices, selectedOfficeId, setSelectedOfficeId }) {
    const [localSelectedId, setLocalSelectedId] = useState(selectedOfficeId ?? null);

    useEffect(() => {
        setLocalSelectedId(selectedOfficeId);
    }, [selectedOfficeId]);

    const selectedOffice = useMemo(() => {
        if (!localSelectedId || !offices?.length) return null;
        return offices.find((o) => String(o._id) === String(localSelectedId)) || null;
    }, [offices, localSelectedId]);

    const sortedOffices = useMemo(() => {
        return [...offices]
            .filter((o) => o && (o.name || o.office))
            .sort((a, b) =>
                extractOfficeName(a.name || a.office).localeCompare(
                    extractOfficeName(b.name || b.office),
                    "bg"
                )
            );
    }, [offices]);

    const handleChange = (val) => {
        setLocalSelectedId(String(val));
        setSelectedOfficeId(String(val));
    };

    return (
        <div className="relative">
            <Listbox value={localSelectedId} onChange={handleChange}>
                <div className="relative">
                    <ListboxButton className="relative w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-md focus:outline-none">
                        <span className="block truncate">
                            {selectedOffice
                                ? `${getOfficeDisplayName(selectedOffice)} - ${selectedOffice.address}`
                                : "Избери офис"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg focus:outline-none">
                        {sortedOffices.map((o) => (
                            <ListboxOption key={o._id} value={String(o._id)}>
                                {({ selected }) => (
                                    <div
                                        className={`cursor-default select-none py-2 px-4 ${selected ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-800"
                                            }`}
                                    >
                                        <span className="block truncate">
                                            {getOfficeDisplayName(o)} - {o.address}
                                        </span>
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
            {selectedOffice && (
                <p className="mt-5 text-sm text-gray-700">
                    ✅ Избран офис: <strong>{getOfficeDisplayName(selectedOffice)}</strong>, {selectedOffice.address}
                </p>
            )}
        </div>
    );
}

function getOfficeDisplayName(office) {
    if (!office) return "";
    return office.name || office.office || "";
}

function extractOfficeName(str) {
    return typeof str === "string" ? str.trim() : "";
}
