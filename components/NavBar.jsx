import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { House, BookText, MessageSquare } from "lucide-react";

const NavBar = () => {
	const location = useLocation();

	//const [numChats, setNumChats] = useState(0);

	const nc = localStorage.getItem("numChats");
	console.log(nc);
	// useEffect(() => {
	// 	const numChats = localStorage.getItem("chats");
	// });

	const isActive = (path) => location.pathname === path;

	return (
		<div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center h-16">
			<Link
				to="/main"
				className={`flex flex-col items-center text-xs ${
					isActive("/main") ? "text-rose-500" : "text-gray-400"
				}`}
			>
				<House />
				Home
			</Link>
			<Link
				to="/guide"
				className={`flex flex-col items-center text-xs ${
					isActive("/guide") ? "text-rose-500" : "text-gray-400"
				}`}
			>
				<BookText />
				Guides
			</Link>
			<Link
				to="/chat"
				className={`relative flex flex-col items-center text-xs ${
					isActive("/chat") ? "text-rose-500" : "text-gray-400"
				}`}
			>
				<MessageSquare />
				Chat
				<span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full px-1">
					{nc}
				</span>
			</Link>
		</div>
	);
};

export default NavBar;
