import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const SizeGuide = () => {
    const { t } = useTranslation();
    const [height, setHeight] = useState(175);
    const [weight, setWeight] = useState(75);
    const [bodyType, setBodyType] = useState('Regular');
    const [recommendedSize, setRecommendedSize] = useState('M');
    const [measurements, setMeasurements] = useState({
        chest: '96-101',
        waist: '81-86',
        length: '71-74'
    });

    // حساب المقاس بناءً على البيانات
    useEffect(() => {
        const calculateSize = () => {
            // BMI calculation for basic sizing
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);

            let size = 'M';
            let chest = '96-101';
            let waist = '81-86';
            let length = '71-74';

            // Size calculation based on BMI and body type
            if (bmi < 18.5) {
                // Underweight
                size = 'S';
                chest = '86-91';
                waist = '71-76';
                length = '68-71';
            } else if (bmi >= 18.5 && bmi < 25) {
                // Normal weight
                if (height < 165) {
                    size = 'S';
                    chest = '86-91';
                    waist = '71-76';
                    length = '68-71';
                } else if (height < 180) {
                    size = 'M';
                    chest = '96-101';
                    waist = '81-86';
                    length = '71-74';
                } else {
                    size = 'L';
                    chest = '106-111';
                    waist = '91-96';
                    length = '74-77';
                }
            } else if (bmi >= 25 && bmi < 30) {
                // Overweight
                if (height < 170) {
                    size = 'L';
                    chest = '106-111';
                    waist = '91-96';
                    length = '74-77';
                } else {
                    size = 'XL';
                    chest = '116-121';
                    waist = '101-106';
                    length = '77-80';
                }
            } else {
                // Obese
                size = 'XXL';
                chest = '126-131';
                waist = '111-116';
                length = '80-83';
            }

            // Adjust based on body type
            if (bodyType === 'Athletic') {
                // Athletes usually need larger chest, smaller waist
                const chestParts = chest.split('-');
                chest = `${parseInt(chestParts[0]) + 5}-${parseInt(chestParts[1]) + 5}`;
            } else if (bodyType === 'Slim') {
                // Slim people might need smaller sizes
                if (size === 'XL') size = 'L';
                else if (size === 'L') size = 'M';
                else if (size === 'M') size = 'S';
            } else if (bodyType === 'Broad') {
                // Broad people need larger sizes
                if (size === 'S') size = 'M';
                else if (size === 'M') size = 'L';
                else if (size === 'L') size = 'XL';
            }

            setRecommendedSize(size);
            setMeasurements({ chest, waist, length });
        };

        calculateSize();
    }, [height, weight, bodyType]);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Side - Input Controls */}
                <div>
                    <h3 className="text-xl font-black text-gray-900 mb-6">{t('sizeGuide.quickFinder')}</h3>
                    <div className="space-y-6">
                        {/* Height Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">{t('sizeGuide.height')}</label>
                                <span className="text-lg font-black text-primary-600">{height} cm</span>
                            </div>
                            <input
                                type="range"
                                min="150"
                                max="200"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-900"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>150 cm</span>
                                <span>200 cm</span>
                            </div>
                        </div>

                        {/* Weight Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">{t('sizeGuide.weight')}</label>
                                <span className="text-lg font-black text-primary-600">{weight} kg</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="120"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-900"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>50 kg</span>
                                <span>120 kg</span>
                            </div>
                        </div>

                        {/* Body Type Selector */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('sizeGuide.bodyType')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[t('sizeGuide.athletic'), t('sizeGuide.slim'), t('sizeGuide.regular'), t('sizeGuide.broad')].map((type, idx) => {
                                    const types = ['Athletic', 'Slim', 'Regular', 'Broad'];
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setBodyType(types[idx])}
                                            className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${bodyType === types[idx]
                                                ? 'bg-primary-900 text-white shadow-lg scale-105'
                                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* BMI Indicator */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">{t('sizeGuide.bmi')}</p>
                            <p className="text-2xl font-black text-gray-900">
                                {(weight / Math.pow(height / 100, 2)).toFixed(1)}
                                <span className="text-sm text-gray-500 ml-2 font-normal">
                                    {weight / Math.pow(height / 100, 2) < 18.5 ? t('sizeGuide.underweight') :
                                        weight / Math.pow(height / 100, 2) < 25 ? t('sizeGuide.normal') :
                                            weight / Math.pow(height / 100, 2) < 30 ? t('sizeGuide.overweight') : t('sizeGuide.obese')}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Results */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h4 className="text-lg font-black text-gray-900 mb-6">{t('sizeGuide.recommendedSize')}</h4>

                    {/* Size Display */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-br from-primary-600 to-accent-600 text-white text-7xl font-black w-40 h-40 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            {recommendedSize}
                        </div>
                        <p className="text-xs text-gray-500 mt-4">{t('sizeGuide.perfectFit')}</p>
                    </div>

                    {/* Measurements Table */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-semibold">{t('sizeGuide.chest')}</span>
                            <span className="font-black text-gray-900">{measurements.chest} cm</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-semibold">{t('sizeGuide.waist')}</span>
                            <span className="font-black text-gray-900">{measurements.waist} cm</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-600 font-semibold">{t('sizeGuide.length')}</span>
                            <span className="font-black text-gray-900">{measurements.length} cm</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        to={`/shop?size=${recommendedSize}`}
                        fullWidth
                        className="mt-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        {t('sizeGuide.shopSize', { size: recommendedSize })} →
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-4">
                    {t('sizeGuide.tip')}
                </p>
                <Link to="/size-guide" className="text-primary-600 font-bold text-sm hover:underline">
                    {t('sizeGuide.viewFullGuide')} →
                </Link>
            </div>
        </div>
    );
};

export default SizeGuide;
