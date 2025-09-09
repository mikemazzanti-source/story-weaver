import { useState, useEffect } from "react";
import "./index.css";
import React from "react";

function App() {
  const [genre, setGenre] = useState("Sci-Fi");
  const [subgenre, setSubgenre] = useState("Space Opera");
  const [intensity, setIntensity] = useState(5);
  const [creativity, setCreativity] = useState(0.7);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [storyReady, setStoryReady] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleStart = async () => {
    setLoading(true);
    setStory("");
    const systemPrompt = `You are a master storyteller. Write a short, engaging story based on the user's selections. Your story should have a clear beginning, middle, and end. The story should be ${genre} with elements of ${subgenre}. The intensity of the story should be on a scale of 1 to 10, with a rating of ${intensity}.`;
    const userPrompt = `Start a new story.`;

    const body = {
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: parseFloat(creativity),
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setStory(data.choices[0].message.content);
    setLoading(false);
    setStoryReady(true);
  };

  const handleContinue = async () => {
    setLoading(true);
    const systemPrompt = `You are a master storyteller. Continue the story that the user has started. Take into account the user's updated selections. The story should be ${genre} with elements of ${subgenre}. The intensity of the story should be on a scale of 1 to 10, with a rating of ${intensity}.`;
    const userPrompt = `Continue the story from here: ${story}`;

    const body = {
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: parseFloat(creativity),
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setStory(story + " " + data.choices[0].message.content);
    setLoading(false);
  };

  const handleReset = () => {
    setStory("");
    setLoading(false);
    setStoryReady(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <h1 className="title">Story Weaver</h1>
      <p className="description">
        Craft your own narrative with the power of AI. Select your options and
        watch a story unfold.
      </p>

      <div className="controls">
        <div className="select-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Mystery">Mystery</option>
            <option value="Horror">Horror</option>
            <option value="Western">Western</option>
            <option value="Thriller">Thriller</option>
            <option value="Dystopian">Dystopian</option>
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="subgenre">Subgenre</label>
          <select
            id="subgenre"
            value={subgenre}
            onChange={(e) => setSubgenre(e.target.value)}
          >
            <option value="Space Opera">Space Opera</option>
            <option value="Steampunk">Steampunk</option>
            <option value="Cyberpunk">Cyberpunk</option>
            <option value="Romantic">Romantic</option>
            <option value="Comedy">Comedy</option>
            <option value="Post-Apocalyptic">Post-Apocalyptic</option>
            <option value="Gothic">Gothic</option>
            <option value="Hard Sci-Fi">Hard Sci-Fi</option>
            <option value="Alternate History">Alternate History</option>
            <option value="Military">Military</option>
          </select>
        </div>

        <div className="slider-group">
          <label htmlFor="intensity">Intensity</label>
          <input
            type="range"
            id="intensity"
            min="1"
            max="10"
            step="1"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
          />
          <span className="slider-value">{intensity}</span>
        </div>

        <div className="slider-group">
          <label htmlFor="creativity">Creativity</label>
          <input
            type="range"
            id="creativity"
            min="0.1"
            max="1.0"
            step="0.1"
            value={creativity}
            onChange={(e) => setCreativity(e.target.value)}
          />
          <span className="slider-value">{creativity}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleStart}>Start Story</button>
      </div>

      {storyReady && (
        <div className="story-container">
          <div className="story-text">{story}</div>
          <div className="continue-buttons">
            <button onClick={handleContinue}>Continue Story</button>
            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Make New Selections
            </button>
            <button onClick={handleReset}>Start Over</button>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default App;