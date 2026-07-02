import NavBar from "@/components/NavBar";
import { useParams } from "react-router-dom";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Heart,
	X,
	ChevronLeft,
	CheckCircle2,
	RotateCcw,
	ArrowBigLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import HeaderBar from "@/components/HeaderBar";

const slidesQ1 = [
	{
		title: "Step 1: Get Treats 🍖",
		description:
			"Make sure your cat is calm and offer some treats before you begin.",
		image: "/images/guide/catfood.jpg",
	},
	{
		title: "Step 2: Gently Hold the Paw 🐾",
		description:
			"Press gently on the paw pad to extend the nails. Be gentle, don't squish.",
		image: "/images/guide/trimnail0.avif",
	},
	{
		title: "Step 3: Trim Carefully ✂️",
		description: "Only trim the sharp tip. Avoid the pink part (quick)!",
		image: "/images/guide/trimnail.avif",
	},
];

const slidesQ2 = [
	{
		title: "Step 1: Choose High-Quality Food 🥩",
		description:
			"Look for cat food with real meat as the first ingredient. Avoid fillers like corn, soy, or vague 'meat by-products'.",
		image: "/images/guide/food1.jpg",
	},
	{
		title: "Step 2: Match Food to Life Stage 🎂",
		description:
			"Kittens, adults, and seniors have different needs. Choose food that's age-appropriate so they grow (or nap) strong.",
		image: "/images/guide/food2.jpg",
	},
	{
		title: "Step 3: Monitor Portions 🧮",
		description:
			"Follow the portion guide on the label based on your cat’s weight and activity level. Overfeeding = chunky loaf risk.",
		image: "/images/guide/food3.jpg",
	},
	{
		title: "Step 4: Provide Fresh Water 💧",
		description:
			"Always have clean water available. Many cats love drinking from fountains — it feels fancier and encourages hydration.",
		image: "/images/guide/food4.jpg",
	},
	{
		title: "Step 5: Avoid Toxic Foods 🚫",
		description:
			"No onions, garlic, chocolate, grapes, or dairy. Your cat might beg, but not everything human = safe for cats.",
		image: "/images/guide/food5.jpg",
	},
];

const slidesQ3 = [
	{
		title: "Step 1: Gather Your Supplies 🧤",
		description:
			"You’ll need gloves, a scooper, trash bags, and optional mask (if you're sensitive to smells).",
		image: "/images/guide/litter1.jpg",
	},
	{
		title: "Step 2: Scoop Daily, Thank Yourself Later 🗑️",
		description:
			"Scoop out clumps and solid waste at least once a day. Your cat (and your nose) will thank you.",
		image: "/images/guide/litter2.jpeg",
	},
	{
		title: "Step 3: Top Off the Litter 🪣",
		description:
			"After scooping, add a bit of fresh litter to maintain the ideal depth (about 2–3 inches).",
		image: "/images/guide/litter3.jpg",
	},
	{
		title: "Step 4: Deep Clean Weekly 🧼",
		description:
			"Once a week, dump all the litter, wash the box with mild soap, dry it, and refill with fresh litter.",
		image: "/images/guide/litter4.jpg",
	},
	{
		title: "Step 5: Dispose Responsibly 🚮",
		description:
			"Seal waste in a bag and toss it in the trash. Do *not* flush clumps—your pipes will cry.",
		image: "/images/guide/litter5.avif",
	},
];

const slidesQ5 = [
	{
		title: "Step 1: Prep Everything First 🔧",
		description:
			"Lay out towels, cat-safe shampoo, a cup for rinsing, and a non-slip mat. Have everything within reach—you won’t get a second chance.",
		image: "/images/guide/bath2.jpg",
	},
	{
		title: "Step 2: Use Lukewarm Water 🌡️",
		description:
			"Fill the tub or sink with a few inches of lukewarm water. No showers or strong sprays—just gentle pouring with a cup.",
		image: "/images/guide/bath3.jpg",
	},
	{
		title: "Step 3: Wash Gently, Avoid Face 🙀",
		description:
			"Massage the shampoo into their fur, avoiding eyes and ears. Rinse thoroughly—leftover soap = itchy regret.",
		image: "/images/guide/bath4.jpg",
	},
	{
		title: "Step 4: Dry and Reassure 🧺",
		description:
			"Wrap your cat in a towel burrito. Pat dry (don’t rub). Use a hairdryer on low if your cat tolerates it—and offer treats like you just survived a war together.",
		image: "/images/guide/bath5.jpg",
	},
];

const slidesQ4 = [
	{
		title: "Step 1: Pick a Toy 🎣",
		description:
			"Feather wand? Laser pointer? Crinkly mouse? Try different toys to see what sparks your cat’s inner hunter.",
		image: "/images/guide/play1.jpg",
	},
	{
		title: "Step 2: Let Them Chase, Not Just Watch 🕵️‍♂️",
		description:
			"Move the toy like real prey — slow, sneaky, and unpredictable. Make it fun, not frustrating.",
		image: "/images/guide/play2.jpg",
	},
	{
		title: "Step 3: Keep Sessions Short But Frequent ⏱️",
		description:
			"Play for 5–15 minutes at a time. Once or twice a day is perfect for keeping them happy and active.",
		image: "/images/guide/play3.jpg",
	},
	{
		title: "Step 4: Let Them ‘Win’ 💥",
		description:
			"End the game with a ‘catch’ — let them pounce on the toy and feel victorious. Instant serotonin boost.",
		image: "/images/guide/play4.jpg",
	},
	{
		title: "Step 5: Cool Down With Treats or Cuddles 🍗",
		description:
			"Reward their effort with a treat, some water, or chill cuddles. Playing builds trust, too!",
		image: "/images/guide/play5.jpg",
	},
];

const catQuestions = {
	q1: {
		title: "✂️ Nail Trimming Guide 🐾",
		steps: "",
		slides: slidesQ1,
	},
	q2: {
		title: "🍽️ Choosing the Right Food for Your Cat 🐾",
		steps: [
			/* other slide content */
		],
		slides: slidesQ2,
	},
	q3: {
		title: "🐱 Clean the Litter Box 🧤",
		steps: [
			/* other slide content */
		],
		slides: slidesQ3,
	},
	q4: {
		title: "🐾 Play With Your Cat 🧤",
		steps: [
			/* other slide content */
		],
		slides: slidesQ4,
	},
	q5: {
		title: "🐱 Bathing Your Cat 🐱",
		steps: [
			/* other slide content */
		],
		slides: slidesQ5,
	},

	// ... more questions
};

const SubPage = () => {
	const { questionId } = useParams();
	const content = catQuestions[questionId];

	if (!content) return <p>Question not found 😿</p>;

	const navigate = useNavigate();

	return (
		<>
			<HeaderBar />
			<div className="min-h-screen flex flex-wrap flex-col items-center justify-center gap-8">
				<h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-md">
					{content.title}
				</h1>

				<Carousel className="w-full max-w-xs">
					<CarouselContent>
						{content.slides.map((slide, index) => (
							<CarouselItem key={index}>
								<div className="p-1">
									<Card>
										<CardContent className="h-85 flex flex-col items-center justify-center p-6 space-y-3 text-center">
											<img
												src={slide.image}
												alt={slide.title}
												className="w-60 h-50 object-contain"
											/>
											<h2 className="text-xl font-bold">{slide.title}</h2>
											<p className="text-sm text-gray-600">
												{slide.description}
											</p>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
				<button
					onClick={() => navigate("/guide")}
					className="z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
				>
					<ArrowBigLeft className="w-6 h-6 text-red-500 fill-red-500" />
					<span className="text-gray-800 font-medium">Back</span>
				</button>
			</div>

			<NavBar />
		</>
	);
};
export default SubPage;
