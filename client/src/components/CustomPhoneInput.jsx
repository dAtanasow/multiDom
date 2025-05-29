import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { PHONE_LENGTHS } from '../constants/phoneLengths';

export default function CustomPhoneInput({ value, onChange, error, setError }) {
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
            if (digitsWithoutDial.length < min || digitsWithoutDial.length > max) {
                setError(true);
            } else {
                setError(false);
            }
        }

        setCountryCode(upperCountryCode);
        setInputValue(formatted);
        onChange(formatted);
    };

    const handleCountryChange = (code) => {
        setCountryCode(code.toUpperCase());
    };

    return (
        <div>
            <PhoneInput
                country={countryCode.toLowerCase()}
                value={inputValue}
                onChange={handleRawChange}
                onCountryChange={handleCountryChange}
                enableSearch
                inputProps={{
                    name: 'phone',
                    required: true
                }}
                inputStyle={{
                    width: '100%',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 0.5rem 0.5rem 48px',
                    border: error ? '1px solid red' : '1px solid #ccc',
                }}
            />
            {error && <p className="text-sm text-red-500">Невалиден брой цифри</p>}
        </div>
    );
};
