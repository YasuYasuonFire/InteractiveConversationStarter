"use client";
import React, { useState, useEffect, useCallback } from 'react';

function MainComponent() {
  const [situation, setSituation] = useState("");
  const [position, setPosition] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [proximity, setProximity] = useState(50);
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState({ type: "", value: "" });

  const situations = [
    { value: "meeting", label: "会議前" },
    { value: "elevator", label: "エレベーター" },
    { value: "break_room", label: "休憩室" },
    { value: "party", label: "飲み会" },
    { value: "encounter", label: "偶然遭遇" },
  ];

  const positions = [
    { value: "junior", label: "後輩" },
    { value: "peer", label: "同僚" },
    { value: "superior", label: "目上" },
    { value: "president", label: "社長" },
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
        if (activeButton.type === "situation") {
          setSituation(activeButton.value);
        } else if (activeButton.type === "position") {
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
        body: JSON.stringify({ situation, position, ageGroup, proximity, date: new Date().toISOString() }),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              スピーディー気まずさ解消！
            </h1>
            <p className="text-gray-600 text-sm">会話のきっかけを見つけよう💬</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📍</span>シチュエーション
              </label>
              <div className="grid grid-cols-2 gap-3">
                {situations.map((sit) => (
                  <button
                    key={sit.value}
                    onClick={() => handleButtonClick("situation", sit.value)}
                    className={`group relative py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium transform hover:scale-105 ${
                      (activeButton.type === "situation" &&
                        activeButton.value === sit.value) ||
                      situation === sit.value
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    <span className="relative z-10">{sit.label}</span>
                    {((activeButton.type === "situation" && activeButton.value === sit.value) || situation === sit.value) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">👥</span>相手の立場
              </label>
              <div className="grid grid-cols-2 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => handleButtonClick("position", pos.value)}
                    className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium transform hover:scale-105 ${
                      (activeButton.type === "position" &&
                        activeButton.value === pos.value) ||
                      position === pos.value
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🎂</span>相手の年代
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ageGroups.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => handleButtonClick("age", age.value)}
                    className={`py-3 px-3 rounded-xl transition-all duration-300 font-medium text-sm transform hover:scale-105 ${
                      (activeButton.type === "age" &&
                        activeButton.value === age.value) ||
                      ageGroup === age.value
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🤝</span>相手との関係性
              </label>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600">フォーマル</span>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">関係性レベル</div>
                    <div className="bg-gradient-to-r from-blue-500 to-amber-500 bg-clip-text text-transparent font-bold text-lg">
                      {proximity}%
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-600">カジュアル</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proximity}
                    onChange={(e) => setProximity(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${getProximityColor(
                        proximity
                      )} 0%, ${getProximityColor(
                        proximity
                      )} ${proximity}%, #E5E7EB ${proximity}%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateConversation}
              className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                loading || !situation || !position || !ageGroup
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl shadow-purple-200"
              }`}
              disabled={loading || !situation || !position || !ageGroup}
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="mr-3 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    会話スターターを生成
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">🚀</span>
                  </>
                )}
              </div>
              {!loading && !(!situation || !position || !ageGroup) && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>

            {conversation && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg transform animate-fadeIn">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">会話スターター</h3>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{conversation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;