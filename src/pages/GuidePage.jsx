//import { Link } from "next/link"

import NavBar from "@/components/NavBar";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

function looksLikeAQuestion(input) {
	const isBlank = input.trim().length === 0;
	const wordCount = input.trim().split(/\s+/).length;
	const vowels = input.match(/[aeiou]/gi) || [];
	const ratio = vowels.length / Math.max(input.length, 1);
	return !isBlank && wordCount >= 3 && !/[^a-zA-Z0-9\s?.',!]/.test(input);
}
const FormSchema = z.object({
	userQuestion: z
		.string()
		.min(1, { message: "Question cannot be empty." })
		.min(10, {
			message: "Question must be at least 10 characters.",
		})
		.max(250, {
			message: "Question must not be longer than 250 characters.",
		})
		.refine((val) => looksLikeAQuestion(val.trim()), {
			message: "Please enter a valid question.",
		}),
});

import { Label } from "@/components/ui/label";
import {
	Mail,
	ArrowRight,
	Scissors,
	UtensilsCrossed,
	Droplets,
	ToyBrick,
	ShowerHead,
} from "lucide-react";
import HeaderBar from "@/components/HeaderBar";

const buttonGroupStyle =
	"flex min-h-screen flex-wrap flex-col items-center justify-center gap-8";
const buttonStyle =
	"relative w-64 h-12 border-4 bg-gray-100 text-gray-900 rounded flex justify-center items-center";

const GuidePage = () => {
	const navigate = useNavigate();

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(FormSchema),
		defaultValues: {
			userQuestion: "",
			username: ""
		},
	});

	function onSubmit(data) {
		const dataWithUsername = { ...data, username: localStorage.getItem('catter-username') || ""};
		console.log("text before navigate:", dataWithUsername);
		navigate("/guide/userquestion", { state: { data: dataWithUsername } });
	}
	return (
		<div id="main" className="">
			<HeaderBar/>
			<div className={buttonGroupStyle}>
				<div>Recommended For You!</div>
				<Link to="/guide/q1" className={buttonStyle}>
					<div className="flex items-center gap-2">
						<Scissors className="w-4 h-4 absolute left-4" />
						<span>Trim Cat Nails</span>
						<ArrowRight className="w-4 h-4 absolute right-4" />
					</div>
				</Link>
				<Link to="/guide/q2" className={buttonStyle}>
					<div className="flex items-center gap-2">
						<UtensilsCrossed className="w-4 h-4 absolute left-4" />
						<span>Feed the Right Food</span>
						<ArrowRight className="w-4 h-4 absolute right-4" />
					</div>
				</Link>

				<Link to="/guide/q3" className={buttonStyle}>
					<div className="flex items-center gap-2">
						<Droplets className="w-4 h-4 absolute left-4" />
						<span>Clean The Litter Box</span>
						<ArrowRight className="w-4 h-4 absolute right-4" />
					</div>
				</Link>
				<Link to="/guide/q4" className={buttonStyle}>
					<div className="flex items-center gap-2">
						<ToyBrick className="w-4 h-4 absolute left-4" />
						<span>Play with Your Cat</span>
						<ArrowRight className="w-4 h-4 absolute right-4" />
					</div>
				</Link>
				<Link to="/guide/q5" className={buttonStyle}>
					<div className="flex items-center gap-2">
						<ShowerHead className="w-4 h-4 absolute left-4" />
						<span>Bathing Your Cat</span>
						<ArrowRight className="w-4 h-4 absolute right-4" />
					</div>
				</Link>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-64 space-y-6"
					>
						<FormField
							control={form.control}
							name="userQuestion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Don't see your question?</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Type your own question here..."
											className="resize-none"
											{...field}
										/>
									</FormControl>
									{/* <FormDescription>
                                You can <span>@mention</span> other users and organizations.
                            </FormDescription> */}
									<FormMessage />
									<Button type="submit">Submit</Button>
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</div>
			<NavBar />
		</div>
	);
};

export default GuidePage;
