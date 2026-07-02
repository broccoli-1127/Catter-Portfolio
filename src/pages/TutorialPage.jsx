import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import catTutorial from "../assets/cat-tutorial.jpg";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

const TutorialPage = () => {
	return (
		<div className="min-h-screen bg-white flex flex-col items-center pb-24">
			{/* Profile Section */}
			<Carousel className="relative mt-12 w-[90%] max-w-md bg-pink-50 text-center p-6 rounded-3xl shadow-md">
				<CarouselContent>
					{Array.from({ length: 3 }).map((_, index) => (
						<CarouselItem key={index}>
							<div className="p-1">
								<Card className="bg-pink-50 shadow-none border-none">
									<CardContent className="flex aspect-square items-center justify-center p-6">
										{index === 0 ? (
											<div>
												<img
													src={catTutorial}
													className="pb-6"
													alt="Tutorial"
												/>
												<p className="text-xl text-[#5F5B5B] pb-3">
													Find your new furry friends
												</p>
												<p className="text-l text-[#ADA8A8]">
													Make your life more colorful!
												</p>
											</div>
										) : index === 1 ? (
											<div>
												<div className="text-6xl pb-6">👆</div>
												<p className="text-xl text-[#5F5B5B] pb-3">
													Swipe to choose
												</p>
												<p className="text-l text-[#ADA8A8]">
													Swipe right to save the cat, swipe left to reject
												</p>
											</div>
										) : index === 2 ? (
											<div>
												<div className="text-6xl pb-6">📖</div>
												<p className="text-xl text-[#5F5B5B] pb-3">
													Get personalized guides
												</p>
												<p className="text-l text-[#ADA8A8]">
													Quickly access 5 common guides and generate your own!
												</p>
											</div>
										) : (
											<div className="text-gray-400 italic">Coming soon...</div>
										)}
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>

			<Link
				to="/form"
				className="mt-6 bg-rose-300 hover:bg-rose-400 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-200"
			>
				Get Started
			</Link>
		</div>
	);
};

export default TutorialPage;
