import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'EGP' | 'USD' | 'SAR' | 'EUR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    formatPrice: (priceInEgp: number) => string;
    rates: Record<Currency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>('EGP');
    const [rates, setRates] = useState<Record<Currency, number>>({
        EGP: 1,
        USD: 1 / 50,
        SAR: 1 / 13,
        EUR: 1 / 54
    });

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') as Currency;
        if (savedCurrency) setCurrencyState(savedCurrency);

        const fetchRates = async () => {
            try {
                // Fetch base rates for EGP
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/EGP');
                const data = await response.json();

                if (data && data.rates) {
                    setRates({
                        EGP: 1,
                        USD: data.rates.USD,
                        SAR: data.rates.SAR,
                        EUR: data.rates.EUR
                    });
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // Fallback to hardcoded rates is already set in initial state
            }
        };

        fetchRates();
    }, []);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('currency', c);
    };

    const formatPrice = (priceInEgp: number) => {
        const price = priceInEgp * rates[currency];
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 2
        }).format(price);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};
