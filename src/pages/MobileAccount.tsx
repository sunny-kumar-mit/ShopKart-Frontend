import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import {
    User, Package, Heart, ShoppingCart, CreditCard,
    MapPin, TicketPercent, HelpCircle, LogOut, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileAccount = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const menuItems = [
        { icon: User, label: 'My Profile', path: '/profile' },
        { icon: Package, label: 'My Orders', path: '/orders' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart' },
        { icon: CreditCard, label: 'Payments', path: '/payments' },
        { icon: MapPin, label: 'Addresses', path: '/addresses' },
        { icon: TicketPercent, label: 'Coupons & Offers', path: '/coupons' },
        { icon: HelpCircle, label: 'Help Center', path: '/help' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background pb-20">
                {/* Header Section */}
                <div className="bg-gradient-hero p-6 pt-8 text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Hi, {user.name}</h1>
                            <p className="text-primary-foreground/80 text-sm">{user.email}</p>
                            {user.mobile && (
                                <p className="text-primary-foreground/80 text-sm">{user.mobile}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-3 -mt-4">
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Account Settings
                        </div>
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border/50 first:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-foreground">{item.label}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>

                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden mt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/10 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-rose-500">Logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MobileAccount;
