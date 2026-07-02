import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Cat, Home, ChevronRight, Check } from "lucide-react";
import { useFormContext } from "./FormContext";
import { useState } from "react";

const FormPage = () => {
	const navigate = useNavigate();
	const {
		username,
		setUsername,
		formData,
		saveFormData,
		savedForms,
		clearAllForms,
	} = useFormContext();

	const handleSubmit = () => {
		if (!username) {
			alert("Please enter a username before saving.");
			return;
		}
		const formId = saveFormData(username);
		console.log(`Form saved for user ${username}! ID: ${formId}`);

		setUsername(username);

		localStorage.setItem("catIndex", 0);
		localStorage.setItem("numChats", 0);
		sessionStorage.removeItem("catter_session_chats_v1");

		const submitButton = document.querySelector(".submit-button");
		submitButton.innerHTML = "Generating recommendations...";

		setTimeout(() => {
			navigate("/main");
		}, 5000);
	};

	const handleClearAll = () => {
		if (window.confirm("Clear all saved forms from this session?")) {
			clearAllForms();
		}
	};

	const sections = [
		{
			title: "You",
			icon: <User className="w-4 h-4" />,
			items: [
				{ key: "personality", label: "Personality" },
				{ key: "dailyRoutine", label: "Daily Routine" },
				{ key: "freeTime", label: "Free Time" },
			],
		},
		{
			title: "Cat",
			icon: <Cat className="w-4 h-4" />,
			items: [
				{ key: "energy", label: "Energy" },
				{ key: "affectionate", label: "Affectionate" },
				{ key: "talkativeness", label: "Talkativeness" },
			],
		},
		{
			title: "Home",
			icon: <Home className="w-4 h-4" />,
			items: [
				{ key: "volume", label: "Volume" },
				{ key: "homeType", label: "Home Type" },
				{ key: "otherPresence", label: "Other Presence" },
			],
		},
	];

	// Helper to check if field answered
	const isAnswered = (value) => {
		if (value == null) return false;
		if (Array.isArray(value)) return value.length > 0;
		return true;
	};

	// Get number of forms saved for current username
	const savedFormsForUser = username ? savedForms[username] || [] : [];

	return (
		<div className="h-[850px] bg-pink-50 p-4">
			<div className="w-full max-w-md mx-auto flex flex-col h-full">
				{/* Header */}
				<div className="flex-shrink-0 pt-2 pb-1 text-center">
					<h1 className="text-4xl font-bold">
						Catter<span className="ml-1">🐾</span>
					</h1>
				</div>

				<div className="mt-4 space-y-2">
					<p>Not all questions need to be answered.</p>
					<p>However, it will lead to better recommendations.</p>
				</div>

				{/* Content */}
				<div className="flex-1 mt-4 overflow-y-auto space-y-3">
					{sections.map((section) => (
						<Card key={section.title} className="shadow-sm">
							<CardContent className="p-0">
								<div className="flex items-center gap-2 border-b bg-rose-100">
									<h2 className="text-base font-bold flex-1">
										{section.title}
									</h2>
									{section.icon}
								</div>

								{section.items.map((item, itemIndex) => (
									<div
										key={item.key}
										className={`flex items-center justify-between px-2 py-1.5 ${
											itemIndex < section.items.length - 1 ? "border-b" : ""
										} hover:bg-gray-50 cursor-pointer`}
										onClick={() => navigate(`/question?ask=${item.key}`)}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												navigate(`/question?ask=${item.key}`);
											}
										}}
									>
										<span className="text-sm">{item.label}</span>
										<div className="flex items-center gap-1">
											<div
												className={`w-4 h-4 rounded-full flex items-center justify-center ${
													isAnswered(formData[item.key])
														? "bg-green-500"
														: "border border-gray-300"
												}`}
											>
												{isAnswered(formData[item.key]) && (
													<Check className="w-2 h-2 text-white" />
												)}
											</div>
											<ChevronRight className="w-3 h-3 text-gray-400" />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					))}
				</div>

				{/* Username input */}
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value.trim())}
					placeholder="Enter username after you have filled out the form"
					className="mt-2 p-1 border rounded w-full text-center text-sm"
				/>

				{/* Submit Button */}
				<div className="mt-4 space-y-2">
					<Button
						onClick={handleSubmit}
						className="submit-button w-full bg-rose-300 hover:bg-rose-400 text-white font-semibold py-2 rounded-lg shadow-md text-sm"
					>
						Submit Form
					</Button>

					{/* {savedFormsForUser.length > 0 && (
						<>
							<div className="text-xs text-center text-gray-600 bg-green-50 p-2 rounded">
								✅ {savedFormsForUser.length} form
								{savedFormsForUser.length !== 1 ? "s" : ""} saved this session
								for <b>{username}</b>
							</div>
							<Button
								onClick={handleClearAll}
								variant="outline"
								className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-1"
							>
								Clear All
							</Button>
						</>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default FormPage;
