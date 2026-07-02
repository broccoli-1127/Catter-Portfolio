import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FormProvider } from "./pages/FormContext";

import MainPage from "./pages/MainPage";
import GuidePage from "./pages/GuidePage";
import GuideQuestionPage from "./pages/GuidePageQ1";
import GuidePageUserQuestion from "./pages/GuideUserQuestion";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import FormPage from "./pages/FormPage";
import TutorialPage from "./pages/TutorialPage";
import QuestionPage from "./pages/QuestionPage";
import TestPage from "./pages/TestPage";
import "./App.css";

function App() {
	return (
		<FormProvider>
			<Router>
				<Routes>
					<Route path="/" element={<TutorialPage />} />
					<Route path="/main" element={<MainPage />} />
					<Route path="/form" element={<FormPage />} />
					<Route path="/guide" element={<GuidePage />} />
					<Route path="/guide/:questionId" element={<GuideQuestionPage />} />
					<Route
						path="/guide/userquestion"
						element={<GuidePageUserQuestion />}
					/>
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/question" element={<QuestionPage />} />
					<Route path="/test" element={<TestPage />} />
				</Routes>
			</Router>
		</FormProvider>
	);
}

export default App;
