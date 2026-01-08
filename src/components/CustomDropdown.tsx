import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string; icon?: string }[];
    icon?: React.ReactNode;
    placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    paddingLeft: icon ? '3.5rem' : '1.25rem',
                    paddingRight: '3rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    border: '2px solid #e0e7ff',
                    borderRadius: '1rem',
                    outline: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    boxShadow: isOpen ? '0 0 0 4px rgba(99,102,241,0.1)' : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderColor: isOpen ? '#6366f1' : '#e0e7ff'
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.borderColor = '#818cf8';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.15)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.borderColor = '#e0e7ff';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }
                }}
            >
                <span className="flex items-center gap-2">
                    {selectedOption?.icon && <span>{selectedOption.icon}</span>}
                    {selectedOption?.label || placeholder}
                </span>
                <FiChevronDown
                    size={20}
                    className="text-indigo-600 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </button>

            {/* Icon */}
            {icon && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {icon}
                </div>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '2px solid #e0e7ff',
                        borderRadius: '1rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 50,
                        overflow: 'hidden',
                        animation: 'slideDown 0.2s ease-out'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                backgroundColor: value === option.value ? '#6366f1' : 'white',
                                color: value === option.value ? 'white' : '#1f2937',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#1f2937';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }
                            }}
                        >
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                            {value === option.value && (
                                <span className="ml-auto text-white">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomDropdown;
