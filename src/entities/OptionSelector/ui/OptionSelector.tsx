import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux";
import {
    selectOptions,
    selectSelectedValue,
    selectLoading,
    selectMessage,
    selectError,
    fetchOptions,
    optionSelectorActions,
    sendSelectedOption
} from "../../../entities/OptionSelector";
import { useEffect } from "react";
import { Select } from "../../../shared/ui/Select/Select";
import { Button } from "../../../shared/ui/Button/Button";
import { Message } from "../../../shared/ui/Message/Message";
import styles from './OptionSelector.module.css';

export const OptionSelector: React.FC = () => {
    const dispatch = useAppDispatch();

    // Селекторы
    const options = useAppSelector(selectOptions);
    const selectedValue = useAppSelector(selectSelectedValue);
    const isLoading = useAppSelector(selectLoading);
    const message = useAppSelector(selectMessage);
    const error = useAppSelector(selectError);

    // Загружаем опции при монтировании
    useEffect(() => {
        dispatch(fetchOptions());
    }, [dispatch]);

    // Обработчик выбора опции
    const handleOptionChange = (value: string) => {
        dispatch(optionSelectorActions.setSelectedValue(value));
    };

    // Обработчик отправки на сервер
    const handleSendOption = async () => {
        if (!selectedValue) return;

        try {
            await dispatch(sendSelectedOption(selectedValue)).unwrap();
        } catch (err) {
            console.error('Failed to send option:', err);
        }
    };

    // Обработчик сброса
    const handleReset = () => {
        dispatch(optionSelectorActions.reset());
    };

    // Обработчик повторной загрузки
    const handleRetry = () => {
        dispatch(fetchOptions());
    };

    if (isLoading && options.length === 0) {
        return (
            <div className={styles.loading}>
                <Message>Загрузка опций...</Message>
            </div>
        );
    }

    if (error && options.length === 0) {
        return (
            <div className={styles.error}>
                <Message type="error">Ошибка загрузки: {error}</Message>
                <Button onClick={handleRetry}>Повторить попытку</Button>
            </div>
        );
    }

    return (
        <div className={styles.optionSelector}>
            <div className={styles.header}>
                <h2>Выбор опции</h2>
            </div>

            <div className={styles.content}>
                {/* Сообщения */}
                {message && (
                    <Message type="success">{message}</Message>
                )}

                {error && (
                    <Message type="error">Ошибка: {error}</Message>
                )}

                {/* Основные элементы управления */}
                <div className={styles.controls}>
                    <div className={styles.selectWrapper}>
                        <Select
                            options={options}
                            value={selectedValue}
                            onChange={handleOptionChange}
                            placeholder="Выберите опцию"
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        onClick={handleSendOption}
                        disabled={!selectedValue || isLoading}
                    >
                        {isLoading ? 'Отправка...' : 'Отправить'}
                    </Button>
                </div>

                {/* Информация о выборе */}
                {selectedValue && (
                    <div className={styles.info}>
                        <p>Выбрано значение: <strong>{selectedValue}</strong></p>
                        <p>
                            Отображаемое имя: {
                            options.find(opt => opt.value === selectedValue)?.name
                        }
                        </p>
                    </div>
                )}

                {/* Кнопки управления */}
                <div className={styles.actions}>
                    <Button
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        Сбросить
                    </Button>

                    <Button
                        onClick={handleRetry}
                        disabled={isLoading}
                    >
                        Обновить опции
                    </Button>
                </div>
            </div>
        </div>
    );
};