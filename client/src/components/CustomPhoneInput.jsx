import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { PHONE_LENGTHS } from '../constants/phoneLengths';
import 'react-phone-input-2/lib/style.css';

export default function CustomPhoneInput({ value, onChange, error, setError, disabled = false }) {
    const [inputValue, setInputValue] = useState('');
    const [countryCode, setCountryCode] = useState('BG');

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleRawChange = (raw, data) => {
        const rawStr = String(raw ?? '');
        const digitsOnly = rawStr.replace(/\D/g, '');
        const upperCountryCode = data?.countryCode?.toUpperCase() || countryCode;
        const dialCode = data?.dialCode || '';
        const len = PHONE_LENGTHS[upperCountryCode] || 15;
        const { min, max } = typeof len === 'object' ? len : { min: len, max: len };

        const digitsWithoutDial = digitsOnly.slice(dialCode.length);
        const formatted = '+' + dialCode + digitsWithoutDial;

        if (setError) {
            setError(digitsWithoutDial.length < min || digitsWithoutDial.length > max);
        }

        setCountryCode(upperCountryCode);
        setInputValue(formatted);
        onChange(formatted);
    };

    return (
        <div className="relative w-full">
            <div className="relative w-full cursor-default overflow-visible rounded-sm border bg-white text-left shadow-md focus:outline-none">
                <PhoneInput
                    country={countryCode.toLowerCase()}
                    value={inputValue}
                    onChange={disabled ? () => { } : handleRawChange}
                    onCountryChange={disabled ? () => { } : (code) => setCountryCode(code.toUpperCase())}
                    enableSearch={!disabled}
                    searchPlaceholder="Търси държава..."
                    containerClass="w-full"
                    inputClass={`w-full pl-12 pr-3 py-2 rounded-md text-sm bg-white ${disabled
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed pointer-events-none'
                        : 'border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    buttonClass={`absolute left-0 top-0 h-full px-2 flex items-center bg-white rounded-l-md mr-2${disabled ? 'pointer-events-none opacity-50' : ''
                        }`}
                    inputProps={{
                        readOnly: disabled,
                    }}

                />
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-1">
                    Невалиден брой цифри
                    {PHONE_LENGTHS[countryCode] &&
                        (() => {
                            const len = PHONE_LENGTHS[countryCode];
                            const { min, max } = typeof len === "object" ? len : { min: len, max: len };
                            return ` (очаквани: ${min}${min !== max ? `–${max}` : ""})`;
                        })()}
                </p>
            )}
        </div>
    );
}
