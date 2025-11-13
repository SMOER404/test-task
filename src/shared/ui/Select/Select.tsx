import React, {
    useState,
    useRef,
    useEffect,
    KeyboardEvent,
    useCallback
} from 'react';
import styles from './Select.module.css';

export interface SelectOption {
    name: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
                                                  options,
                                                  value,
                                                  onChange,
                                                  placeholder = 'Выберите опцию',
                                                  disabled = false
                                              }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Фильтрация опций по поиску
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase())
    );

    // Автофокус на input при открытии
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen]);

    // Определение позиции выпадающего списка
    const updatePosition = useCallback(() => {
        if (!selectRef.current) return;

        const rect = selectRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setPosition(spaceBelow < 250 && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }, []);

    // Обработчик клика вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
                setHighlightedIndex(0);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Прокрутка к выделенному элементу
    useEffect(() => {
        if (isOpen && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen) {
            updatePosition();
            setSearch('');
            setHighlightedIndex(0);
        }
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (option: SelectOption) => {
        onChange(option.value);
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (isOpen && filteredOptions[highlightedIndex]) {
                    handleOptionSelect(filteredOptions[highlightedIndex]);
                } else {
                    handleToggle();
                }
                break;

            case 'Escape':
                setIsOpen(false);
                setSearch('');
                setHighlightedIndex(0);
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    handleToggle();
                } else {
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    );
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    handleToggle();
                } else {
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                }
                break;

            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    setSearch('');
                    setHighlightedIndex(0);
                }
                break;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        setHighlightedIndex(0);

        // Автоматически открываем список при вводе
        if (!isOpen && newSearch) {
            updatePosition();
            setIsOpen(true);
        }
    };

    const clearSearch = () => {
        setSearch('');
        inputRef.current?.focus();
    };

    return (
        <div
            className={`${styles.select} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
            ref={selectRef}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
        >
            <div className={styles.header}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    value={isOpen ? search : (selectedOption?.name || '')}
                    onChange={handleSearchChange}
                    onClick={handleToggle}
                    placeholder={placeholder}
                    readOnly={!isOpen}
                    disabled={disabled}
                />

                {!disabled && (
                    <>
                        {isOpen && search && (
                            <button
                                className={styles.clearButton}
                                onClick={clearSearch}
                                type="button"
                            >
                                ×
                            </button>
                        )}
                        <button
                            className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
                            onClick={handleToggle}
                            type="button"
                            disabled={disabled}
                        >
                            ▼
                        </button>
                    </>
                )}
            </div>

            {isOpen && (
                <div className={`${styles.options} ${styles[position]}`} ref={listRef}>
                    {filteredOptions.length === 0 ? (
                        <div className={styles.noOptions}>Нет подходящих опций</div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option.value}
                                className={`${styles.option} ${
                                    option.value === value ? styles.selected : ''
                                } ${
                                    index === highlightedIndex ? styles.highlighted : ''
                                }`}
                                onClick={() => handleOptionSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {option.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};