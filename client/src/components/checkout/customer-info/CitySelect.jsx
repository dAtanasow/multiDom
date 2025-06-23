import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

export default function CitySelect({ cities, selectedCity, setSelectedCity, error, onChange, setError, validators }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelected, setInternalSelected] = useState(selectedCity || "");

    useEffect(() => {
        setInternalSelected(selectedCity || "");
    }, [selectedCity]);

    const filteredCities =
        query === ""
            ? cities
            : cities.filter((city) =>
                city.toLowerCase().includes(query.toLowerCase())
            );

    const handleSelect = (city) => {
        setInternalSelected(city);
        setSelectedCity(city);
        setQuery("");
        setIsOpen(false);
        onChange({ target: { name: "city", value: city, type: "text" } });

        if (typeof validators?.city === "function") {
            const err = validators.city(city, { city });
            setError(prev => {
                const { city: _, ...rest } = prev;
                return err ? { ...rest, city: err } : rest;
            });
        }
    };

    return (
        <div className="relative">
            <Combobox value={internalSelected} onChange={handleSelect}>
                {() => (
                    <div className="relative">
                        <div className={`relative w-full cursor-default overflow-hidden rounded-sm text-left shadow-md focus:outline-none 
                            ${error ? "border border-red-500" : "border"}`}>
                            <ComboboxInput
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={() => internalSelected}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setQuery(val);
                                    setIsOpen(true); // Open dropdown when typing

                                    const match = cities.find(city => city.toLowerCase() === val.toLowerCase());
                                    if (match) {
                                        handleSelect(match);
                                    }
                                }}
                                onFocus={() => setIsOpen(true)}
                                placeholder="Населено място..."
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </ComboboxButton>
                        </div>
                        {isOpen && filteredCities.length > 0 && (
                            <ComboboxOptions
                                static
                                className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border bg-white py-1 text-sm shadow-lg"
                            >
                                {filteredCities.map((city, i) => (
                                    <ComboboxOption
                                        key={i}
                                        value={city}
                                        onClick={() => setIsOpen(false)}
                                        className={({ active }) =>
                                            `cursor-default select-none py-2 px-4 ${
                                                active ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-800"
                                            }`
                                        }
                                    >
                                        {city}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        )}
                    </div>
                )}
            </Combobox>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
