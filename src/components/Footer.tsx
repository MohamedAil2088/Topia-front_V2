import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-50 text-gray-700 pt-20 pb-10 border-t border-gray-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-bold font-display tracking-tighter text-gray-900 block">
                            TOPIA<span className="text-accent-600">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-4">
                            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 font-display uppercase tracking-wider text-sm">{t('navbar.shop')}</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link to="/shop" className="hover:text-primary-600 transition-colors">{t('footer.allProducts')}</Link></li>
                            <li><Link to="/shop?sort=-createdAt" className="hover:text-primary-600 transition-colors">{t('footer.newArrivals')}</Link></li>
                            <li><Link to="/shop?sort=-sold" className="hover:text-primary-600 transition-colors">{t('footer.bestSellers')}</Link></li>
                            <li><Link to="/shop?cat=sale" className="hover:text-primary-600 transition-colors">{t('footer.sale')}</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 font-display uppercase tracking-wider text-sm">{t('footer.support')}</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link to="/contact" className="hover:text-primary-600 transition-colors">{t('footer.contactUs')}</Link></li>
                            <li><Link to="/about" className="hover:text-primary-600 transition-colors">{t('footer.ourStory')}</Link></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">{t('footer.shippingReturns')}</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition-colors">{t('footer.faq')}</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 font-display uppercase tracking-wider text-sm">{t('footer.getInTouch')}</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="mt-1 text-gray-400 flex-shrink-0" />
                                <span>123 Fashion Ave<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-gray-400 flex-shrink-0" />
                                <a href="mailto:hello@topia.com" className="hover:text-primary-600">hello@topia.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-gray-400 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        {t('footer.copyright', { year: new Date().getFullYear() })}
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400 font-medium">
                        <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.privacyPolicy')}</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.termsOfService')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
