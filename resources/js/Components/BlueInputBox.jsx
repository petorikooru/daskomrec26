import React from 'react';

const BlueInputBox = ({
    value,
    onChange,
    placeholder = 'Enter text',
    type = 'text',
    secure = false,
    className = '',
    wrapperClassName = '',
    ...props
}) => {
    return (
        <div className={wrapperClassName}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
                className={` w-full h-10 sm:h-12 bg-[#1E3A5F] text-white text-[20px] px-5 py-3 rounded-xl border-none outline-none font-semibold font-[Cormorant_Infant] focus:ring-2 focus:ring-blue-400 transition
                    ${secure ? 'password-dots' : ''}
                    ${className}
                `}
            />
        </div>
    );
};

export default BlueInputBox;
