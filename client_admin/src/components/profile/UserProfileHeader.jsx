// src/components/profile/UserProfileHeader.jsx

const UserProfileHeader = ({ user }) => {
    if (!user) return null;

    const xpPercentage = (user.experience / user.xpToNextLevel) * 100;

    return (
        <div className="widget-container p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Placeholder for an avatar */}
                <div className="w-24 h-24 rounded-full bg-gray-700 flex-shrink-0"></div>
                
                <div className="flex-grow w-full text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white">{user.email}</h1>
                    {/* Equipped Title will go here when implemented */}
                    <p className="text-teal-400 font-semibold">{user.equippedTitle?.titleBase?.name || 'No Title Equipped'}</p>
                    
                    {/* XP Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-teal-300">Level {user.level}</span>
                            <span className="text-gray-400">{user.experience} / {user.xpToNextLevel} XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Currencies */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-center"><p className="font-bold text-yellow-400 text-xl">{user.temuTokens}</p><p className="text-xs text-gray-400">Temu Tokens</p></div>
                    <div className="text-center"><p className="font-bold text-amber-400 text-xl">{user.gatillaGold}</p><p className="text-xs text-gray-400">Gatilla Gold</p></div>
                    <div className="text-center"><p className="font-bold text-pink-400 text-xl">{user.wendyHearts}</p><p className="text-xs text-gray-400">Wendy Hearts</p></div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeader;