import { useFormContext } from "./FormContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy } from "lucide-react";

const TestPage = () => {
  const { savedForms, formData, clearAllForms } = useFormContext();
  const [selectedUser, setSelectedUser] = useState("");
  const [testData, setTestData] = useState(null);

  const usernames = Object.keys(savedForms);
  const userForms = selectedUser ? savedForms[selectedUser] || [] : [];

  // Add some test data for demonstration
  const addTestData = () => {
    const mockFormData = {
      personality: "Outgoing and social",
      dailyRoutine: "Work from home",
      freeTime: "Evenings and weekends",
      energy: "Medium energy",
      affectionate: "Very affectionate",
      talkativeness: "Quiet",
      volume: "Small apartment",
      homeType: "Apartment",
      otherPresence: "Lives alone"
    };
    setTestData(mockFormData);
  };

  // Check localStorage data
  const getLocalStorageData = () => {
    try {
      const currentForm = localStorage.getItem('catter-current-form');
      const savedForms = localStorage.getItem('catter-saved-forms');
      return {
        currentForm: currentForm ? JSON.parse(currentForm) : null,
        savedForms: savedForms ? JSON.parse(savedForms) : null
      };
    } catch (error) {
      return { error: error.message };
    }
  };

  const localStorageData = getLocalStorageData();

  // Console.log examples for accessing user data
  const logUserDataExamples = () => {
    console.log("=== HOW TO GET FORM DATA FOR A PARTICULAR USER ===");
    
    // Example 1: Get forms for a specific user from savedForms state
    console.log("1. From React state (savedForms):");
    if (usernames.length > 0) {
      const exampleUser = usernames[0];
      const userForms = savedForms[exampleUser];
      console.log(`   savedForms["${exampleUser}"] =>`, userForms);
      
      if (userForms && userForms.length > 0) {
        console.log(`   Latest form for ${exampleUser} =>`, userForms[userForms.length - 1]);
        console.log(`   Just the form data =>`, userForms[userForms.length - 1].data);
      }
    } else {
      console.log("   No users found. Submit a form first!");
    }
    
    // Example 2: Get forms from localStorage directly
    console.log("2. From localStorage:");
    try {
      const savedFormsFromStorage = JSON.parse(localStorage.getItem('catter-saved-forms') || '{}');
      console.log("   All saved forms from localStorage =>", savedFormsFromStorage);
      
      if (Object.keys(savedFormsFromStorage).length > 0) {
        const firstUser = Object.keys(savedFormsFromStorage)[0];
        console.log(`   Forms for "${firstUser}" =>`, savedFormsFromStorage[firstUser]);
      }
    } catch (error) {
      console.log("   localStorage not available in this environment");
    }
    
    // Example 3: Using the context method
    console.log("3. Using getSavedFormsByUsername method:");
    if (usernames.length > 0) {
      const exampleUser = usernames[0];
      const { getSavedFormsByUsername } = useFormContext();
      const forms = getSavedFormsByUsername(exampleUser);
      console.log(`   getSavedFormsByUsername("${exampleUser}") =>`, forms);
    }
    
    console.log("=== END EXAMPLES ===");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy to clipboard");
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Form Data JSON</h1>

        {/* Current Form Data */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Current Form Data</h2>
              <Button
                onClick={() => copyToClipboard(JSON.stringify(formData, null, 2))}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Saved Forms */}
        {usernames.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Saved Forms</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select User:</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All users...</option>
                  {usernames.map(username => (
                    <option key={username} value={username}>
                      {username} ({savedForms[username].length} forms)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">
                  {selectedUser ? `${selectedUser}'s Forms` : "All Saved Forms"}
                </h3>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(selectedUser ? userForms : savedForms, null, 2))}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                <pre>{JSON.stringify(selectedUser ? userForms : savedForms, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simple example at the bottom */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Quick Access Example:</h3>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                // How to access form data for user "test"
                const testUserForms = savedForms["test"];
                console.log("Forms for user 'test':", testUserForms);
                
                if (testUserForms && testUserForms.length > 0) {
                  console.log("Latest form for user 'test':", testUserForms[testUserForms.length - 1]);
                  console.log("Just the form data:", testUserForms[testUserForms.length - 1].data);
                } else {
                  console.log("No forms found for user 'test'");
                }
              }}
              size="sm"
            >
              Console.log "test" user data
            </Button>
            
            <Button 
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all saved forms and current form data?")) {
                  clearAllForms();
                  alert("All data cleared!");
                }
              }}
              size="sm"
              variant="destructive"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;