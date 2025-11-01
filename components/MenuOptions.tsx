
import React from 'react';

interface MenuOption {
    icon: string;
    text: string;
    tooltip?: string;
}

interface MenuOptionsProps {
    options: MenuOption[];
    onOptionClick: (text: string) => void;
}

export const MenuOptions: React.FC<MenuOptionsProps> = ({ options, onOptionClick }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onOptionClick(option.text)}
                    title={option.tooltip}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
                >
                    <span className="text-3xl mb-2">{option.icon}</span>
                    <span className="text-sm text-center text-gray-700 dark:text-gray-200">{option.text}</span>
                </button>
            ))}
        </div>
    );
};