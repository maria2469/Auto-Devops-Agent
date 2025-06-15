import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVial, FaRocket, FaEllipsisH, FaRobot } from "react-icons/fa";

export default function AutoDevOpsAgent() {
    const [repoUrl, setRepoUrl] = useState("");
    const [platform, setPlatform] = useState("");
    const [files, setFiles] = useState("requirements.txt,app.py");
    const [pipelineYaml, setPipelineYaml] = useState("");
    const [explanation, setExplanation] = useState("");
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        const fileList = files.split(',').map(file => file.trim());
        setLoading(true);
        try {
            const response = await fetch("https://web-production-abd3.up.railway.app/generate-cicd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo_url: repoUrl, platform, files: fileList }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Error ${response.status}: ${errorText}`);
                return;
            }

            const data = await response.json();
            setPipelineYaml(data.yaml || "");
            setExplanation(data.explanation || "");
            setShowExplanation(false);
        } catch (error) {
            console.error("Error generating pipeline:", error);
            alert("Server error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([pipelineYaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ci-cd-pipeline.yml";
        link.click();
    };

    const renderFormattedExplanation = (text) => {
        return text.split('\n').map((line, index) => {
            if (/^\*\*Step \d+:.*\*\*$/.test(line)) {
                return <p key={index} className="font-bold text-gray-800 mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
            }
            if (/^\* /.test(line)) {
                const boldMatch = line.match(/\*\*(.*?)\*\*/);
                return (
                    <li key={index} className="list-disc list-inside text-sm text-gray-700 mb-1">
                        {boldMatch ? (
                            <>
                                <strong>{boldMatch[1]}</strong>{line.split(`**${boldMatch[1]}**`)[1]}
                            </>
                        ) : line.slice(2)}
                    </li>
                );
            }
            if (/\*\*(.*?)\*\*/.test(line)) {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={index} className="text-sm text-gray-700 mb-2">
                        {parts.map((part, i) =>
                            part.startsWith("**") && part.endsWith("**")
                                ? <strong key={i}>{part.slice(2, -2)}</strong>
                                : <span key={i}>{part}</span>
                        )}
                    </p>
                );
            }
            return <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <div className="flex justify-center mb-2">
                    <FaRobot className="text-5xl text-indigo-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800">Auto-DevOps Agent</h1>
                <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                    Automate CI/CD pipelines using AI. Generate platform-specific deployment scripts based on your repository.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-6"
            >
                <div className="flex gap-3 justify-center mb-2">
                    <button className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"><FaVial /> Test</button>
                    <button className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"><FaRocket /> Deploy</button>
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"><FaEllipsisH /> More</button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository URL</label>
                    <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://github.com/username/repo"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white"
                    >
                        <option value="">Select platform...</option>
                        <option value="vercel">Vercel</option>
                        <option value="streamlit">Streamlit</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Files (comma-separated)</label>
                    <input
                        type="text"
                        value={files}
                        onChange={(e) => setFiles(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="requirements.txt,app.py"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Generate Pipeline
                </button>
            </motion.div>

            {loading && (
                <motion.div className="mt-10 w-full max-w-2xl animate-pulse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
                        <div className="h-32 bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </motion.div>
            )}

            {!loading && pipelineYaml && (
                <motion.div className="mt-10 w-full max-w-2xl" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">📄 Generated YAML</h3>
                            <div className="flex gap-3">
                                <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">Download .yml</button>
                                <button onClick={() => setShowExplanation(!showExplanation)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm">
                                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                                </button>
                            </div>
                        </div>
                        <pre className="bg-gray-900 text-green-100 p-4 rounded-lg text-sm overflow-auto">{pipelineYaml}</pre>
                    </div>

                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                className="bg-white p-6 rounded-xl shadow-md"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-4">📘 Explanation</h3>
                                <div className="text-gray-700 leading-relaxed text-sm">
                                    {renderFormattedExplanation(explanation)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
