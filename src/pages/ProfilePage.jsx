import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Save } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import NavBar from "@/components/NavBar";

const ProfilePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState("");
    const [catDetails, setCatDetails] = useState({
        name: "",
        years: 0,
        months: 0,
        breed: "",
        weight: 0,
        weightUnit: "",
        color: "",
        sex: "",
        spayed: "",
    });

    const username = localStorage.getItem("catter-username") || "";

    // Load catInfo and image on mount
    useEffect(() => {
        const saved = localStorage.getItem("catter-saved-forms");
        const parsed = saved ? JSON.parse(saved) : {};

        if (username && parsed[username] && parsed[username].length > 0) {
            const latestEntry = parsed[username][parsed[username].length - 1];
            const latestCatInfo = latestEntry.catInfo || {};
            const savedImage = latestEntry.catImage || "";
            
            setCatDetails(prev => ({
                ...prev,
                ...latestCatInfo
            }));
            setImage(savedImage);
        }
    }, [username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCatDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convert file to base64 string
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                setImage(base64String);
                
                // If in edit mode, save immediately to localStorage
                if (editMode) {
                    saveCatImage(base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleEdit = () => {
        if (editMode) {
            saveCatInfo(catDetails);
            // Image is already saved when selected, but save again to be sure
            saveCatImage(image);
        }
        setEditMode((prev) => !prev);
    };

    const saveCatInfo = (newCatInfo) => {
        const saved = localStorage.getItem("catter-saved-forms");
        const parsed = saved ? JSON.parse(saved) : {};

        if (!username || !parsed[username] || parsed[username].length === 0) {
            console.error("No saved forms found for this user.");
            return;
        }

        parsed[username][parsed[username].length - 1].catInfo = newCatInfo;
        localStorage.setItem("catter-saved-forms", JSON.stringify(parsed));
    };

    const saveCatImage = (imageData) => {
        const saved = localStorage.getItem("catter-saved-forms");
        const parsed = saved ? JSON.parse(saved) : {};

        if (!username || !parsed[username] || parsed[username].length === 0) {
            console.error("No saved forms found for this user.");
            return;
        }

        parsed[username][parsed[username].length - 1].catImage = imageData;
        localStorage.setItem("catter-saved-forms", JSON.stringify(parsed));
    };

    return (
        <div className="relative h-screen bg-white flex flex-col items-center">
            <HeaderBar/>

            <Card className="relative mt-12 w-[90%] max-w-md bg-pink-50 text-center p-6 rounded-3xl shadow-md">
                <button
                    onClick={toggleEdit}
                    className="absolute top-2 right-2 bg-rose-200 rounded-full p-2 shadow-md flex items-center justify-center"
                >
                    {editMode ? <Save size={16} className="text-white" /> : <Pencil size={16} className="text-white" />}
                </button>

                {editMode ? (
                    <input
                        type="text"
                        name="name"
                        value={catDetails.name}
                        onChange={handleChange}
                        className="text-3xl font-bold mb-4 text-center border rounded px-2 py-1 w-full"
                        placeholder="Name"
                    />
                ) : (
                    <h1 className="text-3xl font-bold mb-4">Name: {catDetails.name}</h1>
                )}

                <div className="relative inline-block">
                    {image ? (
						<div className="w-full aspect-[2955/3694] overflow-hidden shadow-md mx-auto">
							<img
								src={image}
								alt="Upload your own photo"
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						!editMode && (
							<div className="w-full aspect-[2955/3694] flex items-center justify-center text-gray-500 rounded shadow-md mx-auto">
								Upload an image
							</div>
						)
    				)}
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                        />
                    )}
                </div>

                <div className="mt-4 flex flex-col justify-center items-center">
                    <div className="flex flex-col items-start gap-3 w-full">
                        {editMode ? (
                            <>
                                {/* Age */}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="years"
                                        value={catDetails.years}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-16"
                                    />
                                    <span>years</span>
                                    <input
                                        type="number"
                                        name="months"
                                        value={catDetails.months}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-16"
                                    />
                                    <span>months</span>
                                </div>

                                {/* Breed */}
                                <input
                                    type="text"
                                    name="breed"
                                    value={catDetails.breed}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Breed"
                                />

                                {/* Weight */}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={catDetails.weight}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-20"
                                    />
                                    <select
                                        name="weightUnit"
                                        value={catDetails.weightUnit}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    >   
                                        <option value="">Weight unit</option>
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                    </select>
                                </div>

                                {/* Color */}
                                <input
                                    type="text"
                                    name="color"
                                    value={catDetails.color}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Color"
                                />

                                {/* Sex */}
                                <select
                                    name="sex"
                                    value={catDetails.sex}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                >
                                    <option value="">Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>

                                {/* Spayed */}
                                <select
                                    name="spayed"
                                    value={catDetails.spayed}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                >
                                    <option value="">Spayed</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <span><strong>Age:</strong> {catDetails.years} years {catDetails.months} months</span>
                                <span><strong>Breed:</strong> {catDetails.breed}</span>
                                <span><strong>Weight:</strong> {catDetails.weight} {catDetails.weightUnit}</span>
                                <span><strong>Color:</strong> {catDetails.color}</span>
                                <span><strong>Sex:</strong> {catDetails.sex}</span>
                                <span><strong>Spayed:</strong> {catDetails.spayed}</span>
                            </>
                        )}
                    </div>
                </div>
            </Card>
            <NavBar />
        </div>
    );
};

export default ProfilePage;