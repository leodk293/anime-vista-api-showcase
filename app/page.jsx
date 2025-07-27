"use client";
import React, { useState } from "react";
import {
  Copy,
  Play,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Github,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const ApiDocumentation = () => {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const tryEndpoint = async (url, endpointId) => {
    setLoading((prev) => ({ ...prev, [endpointId]: true }));
    setResponses((prev) => ({ ...prev, [endpointId]: null }));

    try {
      const response = await fetch(url);
      const data = await response.json();

      setResponses((prev) => ({
        ...prev,
        [endpointId]: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          data: data,
        },
      }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        [endpointId]: {
          status: 0,
          statusText: "Network Error",
          ok: false,
          error: error.message,
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [endpointId]: false }));
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const ApiEndpoint = ({
    method = "GET",
    title,
    description,
    url,
    parameters,
    exampleUrl,
    endpointId,
    children,
  }) => {
    const isExpanded = expandedSections[endpointId];
    const response = responses[endpointId];
    const isLoading = loading[endpointId];

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                {method}
              </span>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
          <button
            onClick={() => toggleSection(endpointId)}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4 relative group">
          <code className="text-green-400 text-sm font-mono break-all">
            {exampleUrl || url}
          </code>
          <button
            onClick={() => copyToClipboard(exampleUrl || url, endpointId)}
            className="absolute top-3 right-3 p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Copy size={14} className="text-gray-300" />
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            {parameters && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Parameters:
                </h4>
                <div className="space-y-2">
                  {parameters.map((param, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                        {param.name}
                      </span>
                      <span className="text-blue-600 text-sm italic">
                        {param.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {children}

            <button
              onClick={() => tryEndpoint(exampleUrl || url, endpointId)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Try it out
                </>
              )}
            </button>

            {response && (
              <div className="bg-gray-900 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  {response.ok ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <span className="text-white text-sm">
                    Status: {response.status} {response.statusText}
                  </span>
                </div>
                <pre className="text-green-400 text-xs overflow-x-auto max-h-80 overflow-y-auto">
                  {response.error
                    ? `Error: ${response.error}`
                    : JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            🎌 Anime API
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Complete documentation for our comprehensive anime data endpoints
          </p>
        </div>

        {/* Anime Vista API Section */}
        <section className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AV
              </div>
              Anime Vista API
            </h2>
            <p className="text-purple-200">
              Custom anime database with filtering capabilities
            </p>
          </div>

          <div className="space-y-6">
            <ApiEndpoint
              title="Get All Anime"
              description="Retrieve a complete list of all available anime in the database with comprehensive metadata."
              url="https://anime-vista-api.vercel.app/api/anime-vista-list"
              endpointId="vista-all"
            />

            <ApiEndpoint
              title="Filter Anime"
              description="Filter anime by various criteria including season, year, genre, and name. Combine multiple filters for precise results."
              url="https://anime-vista-api.vercel.app/api/anime-vista-filter"
              exampleUrl="https://anime-vista-api.vercel.app/api/anime-vista-filter?season=summer"
              endpointId="vista-filter"
              parameters={[
                {
                  name: "season",
                  type: "string (summer, winter, spring, fall)",
                },
                { name: "year", type: "number" },
                { name: "genre", type: "string" },
                { name: "name", type: "string" },
              ]}
            >
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Example Usage:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="font-mono bg-white p-2 rounded border">
                    ?season=winter&year=2021&genre=action&name=dragon%20ball
                  </div>
                </div>
              </div>
            </ApiEndpoint>
          </div>
        </section>

        {/* Jikan API Section */}
        <section className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                JK
              </div>
              Jikan API (MyAnimeList)
            </h2>
            <p className="text-purple-200">
              Official MyAnimeList data through Jikan API{" "}
              <Link
                target="_blank"
                className=" italic font-bold text-blue-400 underline-offset-2 hover:underline"
                href={"https://docs.api.jikan.moe/"}
              >
                Click here for more
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApiEndpoint
              title="Popular Anime"
              description="Get the most popular anime based on MyAnimeList popularity rankings and user engagement."
              url="https://api.jikan.moe/v4/top/anime?filter=bypopularity"
              endpointId="jikan-popular"
            />

            <ApiEndpoint
              title="Currently Airing"
              description="Fetch anime that are currently broadcasting with real-time updates."
              url="https://api.jikan.moe/v4/top/anime?filter=airing"
              endpointId="jikan-airing"
            />

            <ApiEndpoint
              title="Upcoming Anime"
              description="Get anime that are scheduled to air in the future with release dates."
              url="https://api.jikan.moe/v4/top/anime?filter=upcoming"
              endpointId="jikan-upcoming"
            />

            <ApiEndpoint
              title="Top Rated Anime"
              description="Retrieve the highest rated anime based on user scores and reviews."
              url="https://api.jikan.moe/v4/top/anime"
              endpointId="jikan-top"
            />
          </div>
        </section>

        {/* Detailed Information Section */}
        <section>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-lg">
                📝
              </div>
              Detailed Anime Information
            </h2>
            <p className="text-purple-200">
              Comprehensive anime details, characters, and staff information
            </p>
          </div>

          <div className="space-y-6">
            <ApiEndpoint
              title="Anime Details"
              description="Get comprehensive details about a specific anime including synopsis, ratings, episodes, and complete metadata."
              url="https://api.jikan.moe/v4/anime/{animeId}/full"
              exampleUrl="https://api.jikan.moe/v4/anime/1/full"
              endpointId="anime-details"
              parameters={[
                { name: "animeId", type: "number (MyAnimeList ID)" },
              ]}
            >
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-amber-800 text-sm">
                  <strong>Example:</strong> Use ID 1 for Cowboy Bebop, 20 for
                  Naruto, 11757 for Sword Art Online
                </p>
              </div>
            </ApiEndpoint>

            <ApiEndpoint
              title="Anime Characters"
              description="Get all characters associated with a specific anime, including voice actors and character details."
              url="https://api.jikan.moe/v4/anime/{animeId}/characters"
              exampleUrl="https://api.jikan.moe/v4/anime/1/characters"
              endpointId="anime-characters"
              parameters={[
                { name: "animeId", type: "number (MyAnimeList ID)" },
              ]}
            />

            <ApiEndpoint
              title="Anime Staff"
              description="Get staff information including directors, producers, voice actors, and their roles for a specific anime."
              url="https://api.jikan.moe/v4/anime/{animeId}/staff"
              exampleUrl="https://api.jikan.moe/v4/anime/1/staff"
              endpointId="anime-staff"
              parameters={[
                { name: "animeId", type: "number (MyAnimeList ID)" },
              ]}
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white text-lg">
                📞
              </div>
              Contact & Support
            </h2>
            <p className="text-purple-200">
              Get in touch for API support, feedback, or collaboration
              opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Contact */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Email</h3>
                  <p className="text-gray-600 text-sm">Direct communication</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-mono text-sm text-gray-700 break-all">
                  atnumberone61@gmail.com
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard("atnumberone61@gmail.com", "email")
                }
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <Copy size={16} />
                Copy Email
              </button>
            </div>

            {/* Phone Contact */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Phone</h3>
                  <p className="text-gray-600 text-sm">
                    Business hours support
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-mono text-sm text-gray-700">
                  +212 0684301801
                </p>
              </div>
              <button
                onClick={() => copyToClipboard("+212 0684301801", "phone")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <Copy size={16} />
                Copy Number
              </button>
            </div>

            {/* GitHub Contact */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Github className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">GitHub</h3>
                  <p className="text-gray-600 text-sm">Source code & issues</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-mono text-sm text-gray-700 break-all">
                  https://github.com/leodk293/anime-vista-api
                </p>
              </div>
              <a
                href="https://github.com/leodk293/anime-vista-api"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <ExternalLink size={16} />
                Visit Repository
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3">Need Help?</h3>
              <p className="text-purple-200 mb-4 max-w-2xl mx-auto">
                Whether you're having trouble with API integration, need custom
                endpoints, or want to contribute to the project, we're here to
                help! Feel free to reach out through any of the channels above.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-purple-200 mb-2">
              Built with Next.js and Tailwind CSS
            </p>
            <p className="text-purple-300 text-sm">
              Click on any endpoint to expand and test it directly from this
              documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
