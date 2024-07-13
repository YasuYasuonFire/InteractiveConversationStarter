"use client";
import React, { useState, useEffect, useCallback } from 'react';

function MainComponent() {
  const [position, setPosition] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [proximity, setProximity] = useState(50);
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState({ type: "", value: "" });

  const positions = [
    { value: "junior", label: "後輩" },
    { value: "peer", label: "同僚" },
    { value: "superior", label: "目上" },
  ];

  const ageGroups = [
    { value: "20s", label: "20代" },
    { value: "30s", label: "30代" },
    { value: "40s", label: "40代" },
    { value: "50s", label: "50代+" },
  ];

  useEffect(() => {
    if (activeButton.type && activeButton.value) {
      const timer = setTimeout(() => {
        if (activeButton.type === "position") {
          setPosition(activeButton.value);
        } else if (activeButton.type === "age") {
          setAgeGroup(activeButton.value);
        }
        setActiveButton({ type: "", value: "" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeButton]);

  const handleButtonClick = (type, value) => {
    setActiveButton({ type, value });
  };

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position, ageGroup, proximity, date: new Date().toISOString() }),
      });
      const data = await response.json();
      setConversation(data.conversationStarter);
    } catch (error) {
      console.error("Error generating conversation:", error);
      setConversation("申し訳ありません。会話の生成中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const getProximityColor = (value) => {
    if (value < 33) return "#3B82F6";
    if (value < 66) return "#10B981";
    return "#F59E0B";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        スピーディー気まずさ解消！🤖💬
      </h2>
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium">相手の立場</label>
          <div className="flex justify-between mt-2">
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => handleButtonClick("position", pos.value)}
                className={`flex-1 mx-1 py-2 px-4 rounded transition-colors duration-150 ${
                  (activeButton.type === "position" &&
                    activeButton.value === pos.value) ||
                  position === pos.value
                    ? "bg-[#8B5CF6] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-base font-medium">相手の年代</label>
          <div className="flex justify-between mt-2">
            {ageGroups.map((age) => (
              <button
                key={age.value}
                onClick={() => handleButtonClick("age", age.value)}
                className={`flex-1 mx-1 py-2 px-4 rounded transition-colors duration-150 ${
                  (activeButton.type === "age" &&
                    activeButton.value === age.value) ||
                  ageGroup === age.value
                    ? "bg-[#8B5CF6] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-base font-medium">相手との関係性</label>
          <div className="flex items-center space-x-2 mt-2">
            <span>フォーマル</span>
            <input
              type="range"
              min="0"
              max="100"
              value={proximity}
              onChange={(e) => setProximity(Number(e.target.value))}
              className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${getProximityColor(
                  proximity
                )} 0%, ${getProximityColor(
                  proximity
                )} ${proximity}%, #E5E7EB ${proximity}%, #E5E7EB 100%)`,
              }}
            />
            <span>カジュアル</span>
          </div>
        </div>
        <button
          onClick={generateConversation}
          className={`w-full py-2 px-4 rounded font-medium text-white transition-colors duration-200 ${
            loading || !position || !ageGroup
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#8B5CF6] hover:bg-[#7C3AED]"
          }`}
          disabled={loading || !position || !ageGroup}
        >
          {loading ? (
            <>
              生成中 <i className="fas fa-spinner fa-spin ml-2"></i>
            </>
          ) : (
            <>
              会話スターターを生成 <i className="fas fa-sync-alt ml-2"></i>
            </>
          )}
        </button>

        {conversation && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{conversation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;