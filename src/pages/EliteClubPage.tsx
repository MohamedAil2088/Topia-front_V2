import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import { FiAward, FiZap, FiTarget, FiStar, FiChevronRight, FiGift, FiTruck, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const EliteClubPage = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const points = userInfo?.points || 0;
    const currentTier = userInfo?.tier || 'Bronze';

    const tiers = [
        { name: 'Bronze', minPoints: 0, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100', icon: FiAward, perks: ['Basic Point Collection', 'Email Support'] },
        { name: 'Silver', minPoints: 501, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: FiZap, perks: ['1.2x Points Multiplier', 'Birthday Special Offer'] },
        { name: 'Gold', minPoints: 1501, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: FiStar, perks: ['1.5x Points Multiplier', 'Early Access to Sales', 'Priority Support'] },
        { name: 'Elite', minPoints: 5001, color: 'text-primary-900', bg: 'bg-primary-50', border: 'border-primary-100', icon: FiShield, perks: ['2x Points Multiplier', 'Free Express Shipping', 'Exclusive Collection Access', 'Personal Shopping Assistant'] }
    ];

    const nextTier = tiers.find(t => t.minPoints > points);
    const progress = nextTier ? (points / nextTier.minPoints) * 100 : 100;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-80 flex items-center justify-center bg-primary-950 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
                    >
                        <FiAward className="text-accent-400" />
                        <span className="text-xs font-black uppercase tracking-widest">Topia Rewards Program</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-4 italic">
                        The Elite Club<span className="text-accent-500">.</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto font-medium">Elevate your lifestyle with Topia's exclusive membership program. Every purchase brings you closer to ultimate rewards.</p>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                {/* User Status Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12 mb-16 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-3xl font-black text-primary-950">Welcome, {userInfo?.name.split(' ')[0]}</h2>
                            <p className="text-gray-500 font-bold">You are currently a <span className="text-primary-900 border-b-2 border-primary-900">{currentTier}</span> member.</p>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end text-sm">
                                    <span className="font-black text-primary-900 uppercase tracking-widest">{points} Points</span>
                                    {nextTier && <span className="text-gray-400 font-bold italic">Progress to {nextTier.name}</span>}
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-primary-900 to-accent-600"
                                    ></motion.div>
                                </div>
                                {nextTier && (
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter text-right">
                                        Only {nextTier.minPoints - points} more points to reach {nextTier.name} status
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="w-px h-32 bg-gray-100 hidden md:block"></div>

                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div>
                                <p className="text-4xl font-black text-primary-950">{points}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Available Points</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-primary-950">{tiers.findIndex(t => t.name === currentTier) + 1}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Tier Ranking</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tiers Grid */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-black text-primary-950 mb-4 tracking-tight">Membership Architecture</h3>
                        <p className="text-gray-500 font-medium">Unlock higher dimensions of quality and service</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tiers.map((tier, idx) => (
                            <div
                                key={idx}
                                className={`relative group p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl ${tier.name === currentTier ? 'border-primary-900 shadow-xl bg-primary-50/10' : 'border-gray-100'}`}
                            >
                                {tier.name === currentTier && (
                                    <div className="absolute -top-4 -right-4 bg-primary-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Current Status</div>
                                )}
                                <div className={`w-16 h-16 rounded-2xl ${tier.bg} ${tier.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                                    <tier.icon size={32} />
                                </div>
                                <h4 className={`text-2xl font-black mb-2 ${tier.color}`}>{tier.name}</h4>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8">{tier.minPoints}+ Membership Points</p>

                                <ul className="space-y-4">
                                    {tier.perks.map((perk, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                            <FiChevronRight className="mt-1 flex-shrink-0 text-primary-900" />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ / Info Icons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-gray-50 rounded-[3rem] p-12 md:p-16 border border-gray-100">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-primary-900">
                            <FiGift size={32} />
                        </div>
                        <h5 className="text-xl font-black text-primary-950">Earn Points</h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Earn 1 point for every 10 EGP spent. Points are automatically credited to your vault after order confirmation.</p>
                    </div>
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-primary-900">
                            <FiTruck size={32} />
                        </div>
                        <h5 className="text-xl font-black text-primary-950">VIP Delivery</h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Gold and Elite members enjoy priority processing and express shipping pipelines worldwide.</p>
                    </div>
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-primary-900">
                            <FiTarget size={32} />
                        </div>
                        <h5 className="text-xl font-black text-primary-950">Milestone Gifts</h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Every time you reach a new tier, you'll receive a digital signature gift in your email.</p>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-24 text-center">
                    <Link to="/shop" className="inline-flex items-center gap-4 bg-primary-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary-900/30">
                        Continue Your Journey <FiChevronRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EliteClubPage;
