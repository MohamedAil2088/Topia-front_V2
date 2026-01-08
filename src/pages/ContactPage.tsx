import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiFacebook, FiInstagram, FiTwitter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import api from '../utils/api';

const ContactPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/contact', formData);

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: t('contact.form.successTitle'),
                    text: t('contact.form.successText'),
                    confirmButtonColor: '#0f172a',
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error: any) {
            console.error('Contact form error:', error);
            Swal.fire({
                icon: 'error',
                title: t('contact.form.errorTitle'),
                text: t('contact.form.errorText'),
                confirmButtonColor: '#0f172a'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] transition-colors duration-300 pt-24">
            {/* Hero Section */}
            <div className="relative h-[450px] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 opacity-60 mix-blend-overlay"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative z-10 text-center px-6 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 border border-white/20 rounded-full text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                        {t('contact.hero.support')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black font-display text-white mb-6 tracking-tight">
                        💬 Let's <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">{t('contact.hero.title')}</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        {t('contact.hero.description')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24 -mt-20 relative z-10 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-[#252525]">

                    {/* Contact Information (Dark Side) */}
                    <div className="bg-gray-900 text-white p-12 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-black font-display mb-2">{t('contact.info.title')}</h2>
                            <p className="text-gray-400 mb-12">{t('contact.info.subtitle')}</p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                                        <FiMail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t('contact.info.chat')}</h4>
                                        <p className="text-gray-400 text-sm mb-1">{t('contact.info.chatDesc')}</p>
                                        <a href="mailto:support@topia.com" className="font-bold border-b border-transparent hover:border-white transition-all">support@topia.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                                        <FiMapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t('contact.info.visit')}</h4>
                                        <p className="text-gray-400 text-sm mb-1">{t('contact.info.visitDesc')}</p>
                                        <p className="font-bold">123 Fashion St, Cairo, Egypt</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                                        <FiPhone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t('contact.info.call')}</h4>
                                        <p className="text-gray-400 text-sm mb-1">{t('contact.info.callDesc')}</p>
                                        <p className="font-bold">+20 123 456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h5 className="font-bold mb-4 uppercase tracking-widest text-xs text-gray-400">{t('contact.info.followUs')}</h5>
                            <div className="flex gap-4">
                                {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                                    <a key={i} href="#" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-110">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (Light/Dark Side) */}
                    <div className="lg:col-span-2 p-12 bg-white dark:bg-[#252525]">
                        <h2 className="text-3xl font-black font-display text-gray-900 dark:text-white mb-2">{t('contact.form.title')}</h2>
                        <p className="text-gray-500 mb-8">{t('contact.form.subtitle')}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        className="peer w-full h-14 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-black dark:focus:border-white transition-all font-bold"
                                        placeholder="Name"
                                        id="contactName"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <label htmlFor="contactName" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm font-bold">
                                        {t('contact.form.nameLabel')}
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        className="peer w-full h-14 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-black dark:focus:border-white transition-all font-bold"
                                        placeholder="Email"
                                        id="contactEmail"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <label htmlFor="contactEmail" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm font-bold">
                                        {t('contact.form.emailLabel')}
                                    </label>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="peer w-full h-14 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-black dark:focus:border-white transition-all font-bold"
                                    placeholder="Subject"
                                    id="contactSubject"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                                <label htmlFor="contactSubject" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm font-bold">
                                    {t('contact.form.subjectLabel')}
                                </label>
                            </div>

                            <div className="relative pt-4">
                                <textarea
                                    rows={4}
                                    required
                                    className="peer w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-black dark:focus:border-white transition-all resize-none font-medium"
                                    placeholder="Message"
                                    id="contactMessage"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                                <label htmlFor="contactMessage" className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-8 peer-focus:top-0 peer-focus:text-gray-600 peer-focus:text-sm font-bold">
                                    {t('contact.form.messageLabel')}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all w-full md:w-auto shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? t('contact.form.sending') : t('contact.form.sendButton')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-black font-display text-center text-gray-900 dark:text-white mb-12">{t('contact.faq.title')}</h3>
                    <div className="space-y-4">
                        {[
                            { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
                            { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
                            { q: t('contact.faq.q3'), a: t('contact.faq.a3') }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full px-8 py-6 text-left flex justify-between items-center font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {item.q}
                                    {openFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openFaq === idx && (
                                    <div className="px-8 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
