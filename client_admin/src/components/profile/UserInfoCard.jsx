import { useAuth } from "../../context/AuthContext";
import Widget from "../dashboard/Widget";
import StyledButton from "../ui/StyledButton";

const UserInfoCard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const xpPercentage = user.xpToNextLevel > 0 ? (user.experience / user.xpToNextLevel) * 100 : 0;

  return (
    <Widget title="Operator Profile" className="h-full">
      <div className="flex flex-col items-center text-center h-full">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-primary/50 mb-4"></div>
        <h2 className="text-xl font-bold text-white">{user.username}</h2>
        <p className="text-sm font-semibold text-primary mb-4">
          {user.equippedTitle?.titleBase?.name || "Cognitive Framework User"}
        </p>
        {/* XP Bar */}
        <div className="w-full my-4">
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-teal-300">Level {user.level}</span>
            <span className="text-text-secondary">
              {user.experience} / {user.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
          </div>
        </div>
        <div className="flex-grow"></div> {/* Spacer */}
        <StyledButton className="w-full mt-4">Edit Profile</StyledButton>
      </div>
    </Widget>
  );
};

export default UserInfoCard;
