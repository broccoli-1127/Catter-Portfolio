import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Cat, Home, ArrowLeft, Check } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormContext } from "./FormContext";

const questions = {
  personality: {
    title: "Personality",
    icon: <User className="w-12 h-12 mx-auto text-blue-500 mb-6" />,
    description: "What best describes your personality?",
    hint: "(Check all that apply)",
    multi: true,
    options: [
      { id: "calm", label: "Calm" },
      { id: "energetic", label: "Energetic" },
      { id: "playful", label: "Playful" },
      { id: "affectionate", label: "Affectionate" },
    ],
  },
  dailyRoutine: {
    title: "Daily Routine",
    icon: <User className="w-12 h-12 mx-auto text-green-500 mb-6" />,
    description: "How would you describe your usual week?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "mostlyHome", label: "Home sweet home" },
      { id: "travelOften", label: "Adventures here I come" },
      { id: "balanced", label: "A bit of both" },
    ],
  },
  freeTime: {
    title: "Free Time",
    icon: <User className="w-12 h-12 mx-auto text-purple-500 mb-6" />,
    description: "What do you like to do in your free time?",
    hint: "(Select all that apply)",
    multi: true,
    options: [
      { id: "reading", label: "Reading" },
      { id: "gaming", label: "Gaming" },
      { id: "outdoors", label: "Outdoors" },
      { id: "napping", label: "Napping" },
    ],
  },
  energy: {
    title: "Energy",
    icon: <Cat className="w-12 h-12 mx-auto text-orange-500 mb-6" />,
    description: "How energetic is your cat?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "low", label: "Low energy" },
      { id: "medium", label: "Medium energy" },
      { id: "high", label: "High energy" },
    ],
  },
  affectionate: {
    title: "Affectionate",
    icon: <Cat className="w-12 h-12 mx-auto text-pink-500 mb-6" />,
    description: "How affectionate is your cat?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "cuddly", label: "Cuddly" },
      { id: "independent", label: "Independent" },
      { id: "friendly", label: "Friendly" },
    ],
  },
  talkativeness: {
    title: "Talkativeness",
    icon: <Cat className="w-12 h-12 mx-auto text-red-500 mb-6" />,
    description: "How talkative is your cat?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "quiet", label: "Quiet" },
      { id: "moderate", label: "Moderate" },
      { id: "talkative", label: "Talkative" },
    ],
  },
  volume: {
    title: "Volume",
    icon: <Home className="w-12 h-12 mx-auto text-teal-500 mb-6" />,
    description: "How loud is your home environment?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "quiet", label: "Quiet" },
      { id: "moderate", label: "Moderate" },
      { id: "noisy", label: "Noisy" },
    ],
  },
  homeType: {
    title: "Home Type",
    icon: <Home className="w-12 h-12 mx-auto text-yellow-500 mb-6" />,
    description: "What type of home do you live in?",
    hint: "(Select one)",
    multi: false,
    options: [
      { id: "apartment", label: "Apartment" },
      { id: "house", label: "House" },
      { id: "shared", label: "Shared housing" },
    ],
  },
  otherPresence: {
    title: "Other Presence",
    icon: <Home className="w-12 h-12 mx-auto text-indigo-500 mb-6" />,
    description: "Who else lives with you?",
    hint: "(Check all that apply)",
    multi: true,
    options: [
      { id: "children", label: "Children" },
      { id: "otherPets", label: "Other Pets" },
      { id: "roommates", label: "Roommates" },
    ],
  },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const QuestionPage = () => {
  const query = useQuery();
  const ask = query.get("ask") || "personality";
  const { formData, updateFormData } = useFormContext();

  const question = questions[ask];

  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    const existingData = formData[ask];
    if (existingData !== null) {
      if (Array.isArray(existingData)) {
        setSelectedOptions(new Set(existingData));
      } else {
        setSelectedOptions(new Set([existingData]));
      }
    } else {
      setSelectedOptions(new Set());
    }
    setIsSaved(false);
  }, [ask, formData]);

  const toggleOption = (optionId) => {
    const newSelected = new Set(selectedOptions);

    if (question.multi) {
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
    } else {
      if (newSelected.has(optionId)) {
        newSelected.clear(); // Deselect if clicked again
      } else {
        newSelected.clear();
        newSelected.add(optionId);
      }
    }

    setSelectedOptions(newSelected);
    setIsSaved(false);
  };

  const handleSave = () => {
    const selectedArray = Array.from(selectedOptions);
    const valueToSave = question.multi ? selectedArray : (selectedArray[0] || null);
    
    updateFormData(ask, valueToSave);
    console.log(`Saved selections for "${ask}":`, valueToSave);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">Question not found.</p>
      </div>
    );
  }

  const navigate = useNavigate();

  const questionKeys = Object.keys(questions);
  const currentIndex = questionKeys.indexOf(ask);

  const goPrev = () => {
    if (currentIndex > 0) {
      handleSave();
      const prevQuestion = questionKeys[currentIndex - 1];
      navigate(`/question?ask=${prevQuestion}`);
    }
  };

  const goNext = () => {
    if (currentIndex < questionKeys.length - 1) {
      handleSave();
      const nextQuestion = questionKeys[currentIndex + 1];
      navigate(`/question?ask=${nextQuestion}`);
    }
  };

  return (
    <div className="h-[850px] bg-pink-50 p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Back Button */}
        <Link onClick={handleSave}
          to="/form"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg mb-6 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{question.title}</h1>
          {question.icon}
        </div>

        {/* Question Card */}
        <Card className="bg-rose-100 shadow-sm mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 mb-2">{question.description}</p>
            {question.hint && (
              <p className="text-sm text-gray-600 mb-6">{question.hint}</p>
            )}

            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedOptions.has(option.id)
                      ? "bg-rose-200 border-2 border-rose-300"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{option.label}</span>
                  <div
                    className={`w-6 h-6 ${question.multi ? "rounded" : "rounded-full"} border-2 flex items-center justify-center ${
                      selectedOptions.has(option.id)
                        ? "bg-purple-500 border-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOptions.has(option.id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className={`w-full mb-6 font-semibold py-3 rounded-lg shadow-md transition-colors ${
            isSaved
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-rose-300 hover:bg-rose-400 text-white"
          }`}
          size="lg"
        >
          {isSaved ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Saved!
            </span>
          ) : (
            "Save"
          )}
        </Button>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button onClick={goPrev} variant="outline" className="px-8 py-2 border-gray-300">
            Prev
          </Button>
          <Button onClick={goNext} variant="outline" className="px-8 py-2 border-gray-300">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;