import React, { useState } from 'react';

const App = () => {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // State for all story options
  const [genre, setGenre] = useState("Fantasy");
  const [genreIntensity, setGenreIntensity] = useState(50);
  const [customGenre, setCustomGenre] = useState("");

  const [subgenre, setSubgenre] = useState("None");
  const [subgenreIntensity, setSubgenreIntensity] = useState(50);
  const [customSubgenre, setCustomSubgenre] = useState("");

  const [tone, setTone] = useState("Mysterious");
  const [toneIntensity, setToneIntensity] = useState(50);
  const [customTone, setCustomTone] = useState("");

  const [pacing, setPacing] = useState("Slow and deliberate");
  const [pacingIntensity, setPacingIntensity] = useState(50);
  const [customPacing, setCustomPacing] = useState("");

  const [character, setCharacter] = useState("brave warrior");
  const [customCharacter, setCustomCharacter] = useState("");

  const [pov, setPov] = useState("Third Person");
  const [customPov, setCustomPov] = useState("");
    
  const [dialogueStyle, setDialogueStyle] = useState("Realistic and natural");
  const [dialogueIntensity, setDialogueIntensity] = useState(50);
  const [customDialogueStyle, setCustomDialogueStyle] = useState("");

  const [theme, setTheme] = useState("Vengeance and redemption");
  const [themeIntensity, setThemeIntensity] = useState(50);
  const [customTheme, setCustomTheme] = useState("");

  const [plotTwist, setPlotTwist] = useState("A betrayal by a trusted ally");
  const [plotTwistIntensity, setPlotTwistIntensity] = useState(50);
  const [customPlotTwist, setCustomPlotTwist] = useState("");

  const [atmosphericElements, setAtmosphericElements] = useState("Eerie silence");
  const [atmosphericIntensity, setAtmosphericIntensity] = useState(50);
  const [customAtmosphericElements, setCustomAtmosphericElements] = useState("");

  const [setting, setSetting] = useState("ancient ruin");
  const [settingIntensity, setSettingIntensity] = useState(50);
  const [customSetting, setCustomSetting] = useState("");

  const [wordLength, setWordLength] = useState("Fable");
  const [isContinuing, setIsContinuing] = useState(false);

  // Helper function to get the correct value from a selection, handling custom inputs
  const getEffectiveValue = (selected, custom) => selected === "Custom..." ? custom : selected;

  // Function to handle the API call to generate or continue the story
  const generateStory = async () => {
    setLoading(true);
    setError(null);
    setShowDisclaimer(false);

    // Construct the user prompt based on all selected options
    const effectiveGenre = getEffectiveValue(genre, customGenre);
    const effectiveSubgenre = getEffectiveValue(subgenre, customSubgenre);
    const effectiveTone = getEffectiveValue(tone, customTone);
    const effectivePacing = getEffectiveValue(pacing, customPacing);
    const effectiveCharacter = getEffectiveValue(character, customCharacter);
    const effectivePov = getEffectiveValue(pov, customPov);
    const effectiveDialogueStyle = getEffectiveValue(dialogueStyle, customDialogueStyle);
    const effectiveTheme = getEffectiveValue(theme, customTheme);
    const effectivePlotTwist = getEffectiveValue(plotTwist, customPlotTwist);
    const effectiveAtmosphericElements = getEffectiveValue(atmosphericElements, customAtmosphericElements);
    const effectiveSetting = getEffectiveValue(setting, customSetting);

    // Determine word count based on selection
    let wordCount;
    switch (wordLength) {
      case 'Fable':
        wordCount = 500;
        break;
      case 'Short Story':
        wordCount = 1000;
        break;
      case 'Novella':
        wordCount = 1500;
        break;
      default:
        wordCount = 500;
    }

    let finalPrompt;
    if (isContinuing) {
        // If continuing, tell the model to continue the existing story
        finalPrompt = `Continue the following story, maintaining the existing tone, pacing, and style. The next part should be around ${wordCount / 2} words. Do not restart the narrative or add a new title.\n\n[EXISTING STORY]\n\n${story}\n\n[CONTINUE HERE]`;
    } else {
        // Otherwise, construct a new story prompt from scratch
        finalPrompt = `Write a creative short story based on the user's instructions. Keep it engaging and concise.
        
        The story should be a ${effectiveGenre} genre, with an intensity of ${genreIntensity}/100.
        It should also incorporate elements of the ${effectiveSubgenre} subgenre with an intensity of ${subgenreIntensity}/100.
        The tone is ${effectiveTone}, with an intensity of ${toneIntensity}/100.
        The pacing is ${effectivePacing}, with an intensity of ${pacingIntensity}/100.
        The main character is a ${effectiveCharacter}.
        The story should be told from a ${effectivePov} point of view.
        Dialogue should be ${effectiveDialogueStyle}, with an intensity of ${dialogueIntensity}/100.
        The central theme is ${effectiveTheme}, with an intensity of ${themeIntensity}/100.
        The atmospheric elements are ${effectiveAtmosphericElements}, with an intensity of ${atmosphericIntensity}/100.
        The setting is a ${effectiveSetting}, with an intensity of ${settingIntensity}/100.
        Towards the end of this part, please introduce a plot twist: ${effectivePlotTwist}, with an intensity of ${plotTwistIntensity}/100.
        The story should be around ${wordCount} words.
        
        Begin the story and set the scene. Do not add a title or any introductory phrases.`;
    }
    
    // Define the system instruction for the AI model
    const systemPrompt = "You are a world-class author. Create a compelling narrative based on the user's detailed preferences. Incorporate all the requested elements into the narrative smoothly.";
    
    let retries = 0;
    const maxRetries = 3;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        const payload = {
          contents: [{ parts: [{ text: finalPrompt }] }],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
        };

        const apiKey = "AIzaSyDT1sGIceQLSVmNCleQ_3RLheiXY1MYH_8";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const newText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!newText) {
          throw new Error("Failed to get a valid response from the API.");
        }
        
        // Append new story text to existing story if continuing
        setStory(prevStory => prevStory + "\n\n" + newText);
        setIsContinuing(true);
        success = true;

      } catch (err) {
        console.error("Error generating story:", err);
        retries++;
        if (retries >= maxRetries) {
          setError(err.message || "An unknown error occurred. Please try again later.");
        } else {
            // Wait with exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
      } finally {
        if (success || retries >= maxRetries) {
          setLoading(false);
        }
      }
    }
  };

  // Function to reset the story and all options
  const resetStory = () => {
    setStory("");
    setIsContinuing(false);
    setShowDisclaimer(true);
    setError(null);
  };

  // Helper function to render each option control
  const renderControl = (label, value, setValue, customValue, setCustomValue, options, intensity, setIntensity) => (
    <div className="flex flex-col">
      <label className="text-gray-300 mb-2">{label}</label>
      <select 
        value={value} 
        onChange={(e) => { 
          setValue(e.target.value); 
          if (e.target.value !== "Custom...") { 
            setCustomValue(""); 
          } 
        }} 
        className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-teal-400 transition-colors" 
      > 
        {options.map((opt) => ( 
          <option key={opt} value={opt}>{opt}</option> 
        ))} 
        <option value="Custom...">Add your own</option> 
      </select> 
      {value === "Custom..." && ( 
        <input 
          type="text" 
          value={customValue} 
          onChange={(e) => setCustomValue(e.target.value)} 
          placeholder={`Type your custom ${label.toLowerCase()} here...`} 
          className="mt-2 p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-teal-400 transition-colors" 
        /> 
      )} 
      {intensity !== undefined && ( 
        <div className="mt-4"> 
          <label className="text-gray-300 mb-2 block">Intensity: {intensity}%</label> 
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={intensity} 
            onChange={(e) => setIntensity(e.target.value)} 
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400" 
          /> 
        </div> 
      )} 
    </div> 
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-teal-400">Story Weaver</h1>
        <p className="text-center text-gray-400 mb-8">Craft your own narrative with the power of AI. Select your options and watch a story unfold.</p>

        {showDisclaimer && (
          <div className="bg-blue-900 border border-blue-700 text-blue-200 p-4 rounded-lg text-sm mb-6">
            <p><strong>Disclaimer:</strong> This app uses a language model to generate content. The stories are a creative product of the AI and may not always be what you expect. An internet connection is required to generate stories.</p>
          </div>
        )}

        {/* Controls Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderControl(
            "Genre", genre, setGenre, customGenre, setCustomGenre,
            ["Action & Adventure", "Anime", "Biblical", "Comedies", "Crime", "Documentaries", "Dramas", "Fantasy", "Horror", "Independent", "Mythological", "Mystery", "Romance", "Sci-Fi", "Thriller"],
            genreIntensity, setGenreIntensity
          )}
          {renderControl(
            "Subgenre", subgenre, setSubgenre, customSubgenre, setCustomSubgenre,
            ["None", "Absurdist", "Biblical", "Coming-of-age", "Drama", "Erotica", "Fabulism", "Historical", "Horror", "Mythological", "Satirical", "Social Realism", "Speculative", "Transgressive"],
            subgenreIntensity, setSubgenreIntensity
          )}
          {renderControl(
            "Tone", tone, setTone, customTone, setCustomTone,
            ["None", "Cynical", "Gothic", "Hopeful", "Humorous", "Melancholy", "Mysterious", "Ominous", "Robotic", "Satirical", "Southern Gothic", "Suspenseful", "Weird West", "Whimsical"],
            toneIntensity, setToneIntensity
          )}
          {renderControl(
            "Pacing", pacing, setPacing, customPacing, setCustomPacing,
            ["None", "Epic", "Fast and frantic", "Leisurely", "Slow and deliberate", "Steady and flowing", "Tense and staccato"],
            pacingIntensity, setPacingIntensity
          )}
          {renderControl(
            "Character", character, setCharacter, customCharacter, setCustomCharacter,
            ["adventurous explorer", "brave warrior", "brilliant scientist", "cunning thief", "damsel in distress", "fearless queen", "mischievous rogue", "nurturing healer", "powerful sorcerer", "rebellious princess", "rogue AI", "stoic knight", "tragic heroine", "weary detective", "wise mentor"],
            undefined, undefined
          )}
          {renderControl(
            "Point of View", pov, setPov, customPov, setCustomPov,
            ["First Person", "Omniscient", "Second Person", "Third Person"],
            undefined, undefined
          )}
          {renderControl(
            "Dialogue Style", dialogueStyle, setDialogueStyle, customDialogueStyle, setCustomDialogueStyle,
            ["None", "Cryptic", "Flowery and ornate", "Formal and descriptive", "Internal monologue", "Monologic", "Poetic and metaphorical", "Realistic and natural", "Sarcastic", "Sharp and witty", "Short and punchy", "Witty banter"],
            dialogueIntensity, setDialogueIntensity
          )}
          {renderControl(
            "Atmospheric Elements", atmosphericElements, setAtmosphericElements, customAtmosphericElements, setCustomAtmosphericElements,
            ["None", "Dense fog", "Dust motes in a sunbeam", "Eerie silence", "Haunting echoes", "Heavy rain", "Metallic tang in the air", "Oppressive heat", "Pungent smells", "Swirling snow", "Warm, golden light"],
            atmosphericIntensity, setAtmosphericIntensity
          )}
          {renderControl(
            "Setting", setting, setSetting, customSetting, setCustomSetting,
            ["None", "ancient ruin", "bustling metropolis", "cyberpunk city", "desolate desert planet", "far future", "haunted mansion", "hidden fantasy realm", "high seas", "lush, primordial jungle", "medieval castle", "starship's bridge"],
            settingIntensity, setSettingIntensity
          )}
          {renderControl(
            "Theme", theme, setTheme, customTheme, setCustomTheme,
            ["None", "Existential Dread", "Family", "Hero's Journey", "Identity", "Loss and recovery", "Love Story", "Man vs. nature", "Memory and nostalgia", "Mythological", "Power and corruption", "Survival and sacrifice", "Symbolic", "The nature of reality", "The unknown", "Vengeance and redemption"],
            themeIntensity, setThemeIntensity
          )}
          {renderControl(
            "Plot Twist", plotTwist, setPlotTwist, customPlotTwist, setCustomPlotTwist,
            ["None", "A betrayal by a trusted ally", "A key object is not what it seems", "A shocking reveal of the protagonist's identity", "It was all a dream", "The hero's quest was a lie", "The protagonist is a clone or automaton", "The story is a loop", "The villain was the hero all along"],
            plotTwistIntensity, setPlotTwistIntensity
          )}
          {/* New Word Length Control */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Word Length</label>
            <select 
              value={wordLength} 
              onChange={(e) => setWordLength(e.target.value)} 
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-teal-400 transition-colors" 
            > 
              <option value="Fable">Fable (up to 500 words)</option> 
              <option value="Short Story">Short Story (up to 1000 words)</option> 
              <option value="Novella">Novella (up to 1500 words)</option> 
            </select> 
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={generateStory}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isContinuing ? "Continue Story" : "Start Story"
            )}
          </button>
          <button
            onClick={resetStory}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-md transition-all duration-300"
          >
            Start Over
          </button>
        </div>

        {/* Story Display Area */}
        <div className="bg-gray-900 rounded-lg p-6 shadow-inner min-h-[300px] overflow-auto">
          {error && <p className="text-red-400 text-center">{error}</p>}
          {story ? (
            story.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-200 text-lg leading-relaxed mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-500 text-center italic mt-24">
              Your story will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;