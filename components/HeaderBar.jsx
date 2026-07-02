import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import paw from "@/src/assets/catter-logo.png";

const HeaderBar = () => {
	const location = useLocation();
	const isActive = (path) => location.pathname === path;

	return (
		<div className="fixed top-0 left-0 w-full bg-white border-b flex justify-between items-center h-16 shadow-sm z-50 px-4">
			<div className="flex items-center">
				<img src={paw} alt="Cat" className="w-24 h-24 object-contain" />
			</div>

			<Link
				to="/profile"
				className={`flex flex-col items-center text-xs ${
					isActive("/profile") ? "text-rose-500" : "text-gray-400"
				}`}
			>
				<User size={24} />
				Profile
			</Link>
		</div>
	);
};

export default HeaderBar;
