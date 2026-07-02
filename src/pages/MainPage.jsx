import NavBar from "@/components/NavBar";
import CatSwiper from "./CatSwiper";
import HeaderBar from "@/components/HeaderBar";
import React, { useState, useEffect } from "react";
const MainPage = () => {
	const [reloadKey, setReloadKey] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setReloadKey((prev) => prev + 1); // trigger re-render
		}, 100); // 10 seconds

		return () => clearInterval(interval); // cleanup on unmount
	}, []);

	return (
		<div>
			{/* Logo in top-left */}
			<HeaderBar />

			<CatSwiper />
			<NavBar />
		</div>
	);
};

export default MainPage;
