import React, { useState } from 'react';
import { Search, MapPin, BookOpen, Loader2, AlertCircle, TrendingUp, Award, Users, Filter } from 'lucide-react';
import Logo from './assets/IMG-20240521-WA0022-removebg-preview.png'
import { apiConnector } from './axios/apiConnector';

interface College {
  college: string;
  branch: string;
  status: string; // Added status for nursing
  level: string; // Added level for engineering
}

interface SearchForm {
  searchMethod: 'percentile' | 'rank';
  rank: string;
  percentile: string;
  category: string;
  cities: string; // comma-separated city list
  courseType: 'engineering' | 'pharmacy' | 'nursing'; // Added courseType
  branch: string; // Added branch
}

const simplifiedCategories = [
  { value: 'OPEN', label: 'General Open', color: 'bg-blue-500' },
  { value: 'SC', label: 'General SC', color: 'bg-red-600' },
  { value: 'ST', label: 'General ST', color: 'bg-red-500' },
  { value: 'VJ', label: 'General VJ', color: 'bg-green-600' },
  { value: 'NT1', label: 'General NT1', color: 'bg-indigo-600' },
  { value: 'NT2', label: 'General NT2', color: 'bg-indigo-500' },
  { value: 'NT3', label: 'General NT3', color: 'bg-indigo-400' },
  { value: 'OBC', label: 'General OBC', color: 'bg-orange-500' },
  { value: 'SEBC', label: 'General SEBC', color: 'bg-yellow-500' },

  { value: 'LOPEN', label: 'Ladies Open', color: 'bg-pink-500' },
  { value: 'LSC', label: 'Ladies SC', color: 'bg-pink-600' },
  { value: 'LST', label: 'Ladies ST', color: 'bg-pink-600' },
  { value: 'LVJ', label: 'Ladies VJ', color: 'bg-pink-600' },
  { value: 'LNT1', label: 'Ladies NT1', color: 'bg-pink-600' },
  { value: 'LNT2', label: 'Ladies NT2', color: 'bg-pink-600' },
  { value: 'LNT3', label: 'Ladies NT3', color: 'bg-pink-600' },
  { value: 'LOBC', label: 'Ladies OBC', color: 'bg-pink-600' },
  { value: 'LSEBC', label: 'Ladies SEBC', color: 'bg-pink-600' },

  { value: 'PWDOPEN', label: 'PWD Open', color: 'bg-teal-600' },
  { value: 'PWDSC', label: 'PWD SC', color: 'bg-teal-600' },
  { value: 'PWDST', label: 'PWD ST', color: 'bg-teal-600' },
  { value: 'PWDVJ', label: 'PWD VJ', color: 'bg-teal-600' },
  { value: 'PWDNT1', label: 'PWD NT1', color: 'bg-teal-600' },
  { value: 'PWDNT2', label: 'PWD NT2', color: 'bg-teal-600' },
  { value: 'PWDNT3', label: 'PWD NT3', color: 'bg-teal-600' },
  { value: 'PWDOBC', label: 'PWD OBC', color: 'bg-teal-600' },
  { value: 'PWDSEBC', label: 'PWD SEBC', color: 'bg-teal-600' },

  { value: 'DEFOPEN', label: 'Defence Open', color: 'bg-gray-600' },
  { value: 'DEFSC', label: 'Defence SC', color: 'bg-gray-600' },
  { value: 'DEFST', label: 'Defence ST', color: 'bg-gray-600' },
  { value: 'DEFVJ', label: 'Defence VJ', color: 'bg-gray-600' },
  { value: 'DEFNT1', label: 'Defence NT1', color: 'bg-gray-600' },
  { value: 'DEFNT2', label: 'Defence NT2', color: 'bg-gray-600' },
  { value: 'DEFNT3', label: 'Defence NT3', color: 'bg-gray-600' },
  { value: 'DEFOBC', label: 'Defence OBC', color: 'bg-gray-600' },
  { value: 'DEFSEBC', label: 'Defence SEBC', color: 'bg-gray-600' },

  { value: 'TWFS', label: 'TFWS (Fee Waiver)', color: 'bg-purple-500' },
  { value: 'EWS', label: 'EWS', color: 'bg-lime-500' },
  { value: 'ORPHAN', label: 'Orphan', color: 'bg-fuchsia-500' }
];


const mapToTechnicalCategories = (category: string, courseType: string): string[] => {
  const defaultMap: { [key: string]: string[] } = {
    OPEN: ['GOPENS', 'GOPENH', 'GOPENO'],
    SC: ['GSCS', 'GSCH', 'GSCO'],
    ST: ['GSTS', 'GSTH', 'GSTO'],
    VJ: ['GVJS', 'GVJH', 'GVJO'],
    NT1: ['GNT1S', 'GNT1H', 'GNT1O'],
    NT2: ['GNT2S', 'GNT2H', 'GNT2O'],
    NT3: ['GNT3S', 'GNT3H', 'GNT3O'],
    OBC: ['GOBCS', 'GOBCH', 'GOBCO'],
    SEBC: ['GSEBCS', 'GSEBCH', 'GSEBCO'],

    LOPEN: ['LOPENS', 'LOPENH', 'LOPENO'],
    LSC: ['LSCS', 'LSCH', 'LSCO'],
    LST: ['LSTS', 'LSTH', 'LSTO'],
    LVJ: ['LVJS', 'LVJH', 'LVJO'],
    LNT1: ['LNT1S', 'LNT1H', 'LNT1O'],
    LNT2: ['LNT2S', 'LNT2H', 'LNT2O'],
    LNT3: ['LNT3S', 'LNT3H', 'LNT3O'],
    LOBC: ['LOBCS', 'LOBCH', 'LOBCO'],
    LSEBC: ['LSEBCS', 'LSEBCH', 'LSEBCO'],

    PWDOPEN: ['PWDOPENS', 'PWDOPENH', 'PWDOPENO'],
    PWDSC: ['PWDSCS', 'PWDSCH', 'PWDSCO'],
    PWDST: ['PWDSTS', 'PWDSTH', 'PWDSTO'],
    PWDVJ: ['PWDVJS', 'PWDVJH', 'PWDVJO'],
    PWDNT1: ['PWDNT1S', 'PWDNT1H', 'PWDNT1O'],
    PWDNT2: ['PWDNT2S', 'PWDNT2H', 'PWDNT2O'],
    PWDNT3: ['PWDNT3S', 'PWDNT3H', 'PWDNT3O'],
    PWDOBC: ['PWDOBCS', 'PWDOBCH', 'PWDOBCO'],
    PWDSEBC: ['PWDSEBCS', 'PWDSEBCH', 'PWDSEBCO'],

    DEFOPEN: ['DEFOPENS', 'DEFOPENH', 'DEFOPENO'],
    DEFSC: ['DEFSCS', 'DEFSCH', 'DEFSCO'],
    DEFST: ['DEFSTS', 'DEFSTH', 'DEFSTO'],
    DEFVJ: ['DEFVJS', 'DEFVJH', 'DEFVJO'],
    DEFNT1: ['DEFNT1S', 'DEFNT1H', 'DEFNT1O'],
    DEFNT2: ['DEFNT2S', 'DEFNT2H', 'DEFNT2O'],
    DEFNT3: ['DEFNT3S', 'DEFNT3H', 'DEFNT3O'],
    DEFOBC: ['DEFOBCS', 'DEFOBCH', 'DEFOBCO'],
    DEFSEBC: ['DEFSEBCS', 'DEFSEBCH', 'DEFSEBCO'],

    TWFS: ['TFWS'],
    EWS: ['EWS'],
    ORPHAN: ['ORPHAN']
  };


  const nursingMap: { [key: string]: string[] } = {
    SC: ['SC'],
    ST: ['ST'],
    'VJ-A': ['VJ-A'],
    'NT-B': ['NT-B'],
    'NT-C': ['NT-C'],
    'NT-D': ['NT-D'],
    OBC: ['OBC'],
    SEBC: ['SEBC'],
    EWS: ['EWS'],
    OPEN: ['OPEN'],
    D1: ['D1'],
    D2: ['D2'],
    ORPHEN: ['ORPHEN'],
    PH: ['PH'],
    Others: []
  };

  return courseType === 'nursing'
    ? nursingMap[category] || []
    : defaultMap[category] || [];
};

const branchOptions = [
  "5G",
  "Aeronautical Engineering",
  "Agricultural Engineering",
  "Architectural Assistantship",
  "Artificial Intelligence",
  "Artificial Intelligence (AI) and Data Science",
  "Artificial Intelligence and Data Science",
  "Artificial Intelligence and Machine Learning",
  "Automation and Robotics",
  "Automobile Engineering",
  "Bio Medical Engineering",
  "Bio Technology",
  "Chemical Engineering",
  "Civil Engineering",
  "Civil Engineering and Planning",
  "Civil and Environmental Engineering",
  "Civil and infrastructure Engineering",
  "Computer Engineering",
  "Computer Engineering (Software Engineering)",
  "Computer Science",
  "Computer Science and Business Systems",
  "Computer Science and Design",
  "Computer Science and Engineering",
  "Computer Science and Engineering (Artificial Intelligence and Data Science)",
  "Computer Science and Engineering (Artificial Intelligence)",
  "Computer Science and Engineering (Cyber Security)",
  "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain",
  "Computer Science and Engineering (IoT)",
  "Computer Science and Engineering(Artificial Intelligence and Machine Learning)",
  "Computer Science and Engineering(Cyber Security)",
  "Computer Science and Engineering(Data Science)",
  "Computer Science and Information Technology",
  "Computer Science and Technology",
  "Computer Technology",
  "Cyber Security",
  "Data Engineering",
  "Data Science",
  "Dyestuff Technology",
  "Electrical Engg[Electronics and Power]",
  "Electrical Engineering",
  "Electrical and Computer Engineering",
  "Electrical and Electronics Engineering",
  "Electrical, Electronics and Power",
  "Electronics Engineering",
  "Electronics Engineering ( VLSI Design and Technology)",
  "Electronics and Biomedical Engineering",
  "Electronics and Communication (Advanced Communication Technology)",
  "Electronics and Communication Engineering",
  "Electronics and Communication(Advanced Communication Technology)",
  "Electronics and Computer Engineering",
  "Electronics and Computer Science",
  "Electronics and Telecommunication Engg",
  "Fashion Technology",
  "Fibres and Textile Processing Technology",
  "Fire Engineering",
  "Food Engineering and Technology",
  "Food Technology",
  "Food Technology And Management",
  "Industrial IoT",
  "Information Technology",
  "Instrumentation Engineering",
  "Instrumentation and Control Engineering",
  "Internet of Things (IoT)",
  "Man Made Textile Technology",
  "Manufacturing Science and Engineering",
  "Mechanical & Automation Engineering",
  "Mechanical Engineering",
  "Mechanical Engineering Automobile",
  "Mechanical Engineering[Sandwich]",
  "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
  "Mechatronics Engineering",
  "Metallurgy and Material Technology",
  "Mining Engineering",
  "Oil Fats and Waxes Technology",
  "Oil Technology",
  "Oil and Paints Technology",
  "Oil,Oleochemicals and Surfactants Technology",
  "Paints Technology",
  "Paper and Pulp Technology",
  "Petro Chemical Engineering",
  "Pharmaceutical and Fine Chemical Technology",
  "Pharmaceuticals Chemistry and Technology",
  "Plastic Technology",
  "Plastic and Polymer Engineering",
  "Polymer Engineering and Technology",
  "Printing and Packing Technology",
  "Production Engineering",
  "Production Engineering[Sandwich]",
  "Robotics and Artificial Intelligence",
  "Robotics and Automation",
  "Safety and Fire Engineering",
  "Structural Engineering",
  "Surface Coating Technology",
  "Technical Textiles",
  "Textile Chemistry",
  "Textile Engineering / Technology",
  "Textile Technology",
  "VLSI"
];

function App() {
  const [form, setForm] = useState<SearchForm>({
    searchMethod: 'percentile',
    rank: '',
    percentile: '',
    category: '',
    cities: '',
    courseType: 'engineering', // DEFAULT VALUE
    branch: '' // DEFAULT VALUE
  });
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleInputChange = (field: keyof SearchForm, value: string) => {
    if (field === 'courseType') {
      setForm({
        searchMethod: 'percentile',
        rank: '',
        percentile: '',
        category: '',
        cities: '',
        courseType: value as 'engineering' | 'pharmacy' | 'nursing',
        branch: '' // Reset branch when courseType changes
      });
      setResults([]);         // Clear previous results
      setHasSearched(false);  // Reset search state
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.category) {
      setError('Please select a category');
      return false;
    }

    if (form.searchMethod === 'rank') {
      if (!form.rank || parseInt(form.rank) <= 0) {
        setError('Please enter a valid rank');
        return false;
      }
    } else {
      if (!form.percentile || parseFloat(form.percentile) < 0 || parseFloat(form.percentile) > 100) {
        setError('Please enter a valid percentile (0-100)');
        return false;
      }
    }

    return true;
  };

  const getCategoryOptions = (courseType: string) => {
    if (courseType === 'nursing') {
      // Nursing categories from nursingMap
      return Object.keys({
        SC: ['SC'],
        ST: ['ST'],
        'VJ-A': ['VJ-A'],
        'NT-B': ['NT-B'],
        'NT-C': ['NT-C'],
        'NT-D': ['NT-D'],
        OBC: ['OBC'],
        SEBC: ['SEBC'],
        EWS: ['EWS'],
        OPEN: ['OPEN'],
        D1: ['D1'],
        D2: ['D2'],
        ORPHEN: ['ORPHEN'],
        PH: ['PH'],
        Others: []
      }).map(key => ({
        value: key,
        label: key,
        color: 'bg-blue-500' // You can customize colors per category if needed
      }));
    }
    // Default categories
    return simplifiedCategories;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const technicalCategories = mapToTechnicalCategories(form.category, form.courseType);
      const params = new URLSearchParams({
        ...(form.searchMethod === 'rank'
          ? { rank: form.rank }
          : { percentile: form.percentile }),
        courseType: form.courseType, // ✅ Add courseType to query
        branch: form.branch // ✅ Add branch to query
      });

      technicalCategories.forEach(cat => params.append('category', cat));

      const citiesArray = form.cities
        .split(',')
        .map(city => city.trim())
        .filter(Boolean);
      citiesArray.forEach(city => params.append('cities', city));


      const response = await apiConnector('GET', `https://navodisha-backend.onrender.com/api/colleges?${params.toString()}`);
      if (response.status !== 200) throw new Error('Failed to fetch colleges');
      setResults(response.data);
    } catch (err) {
      setError('Failed to search colleges. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };


  const selectedCategory = simplifiedCategories.find(cat => cat.value === form.category);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-75"></div>
                <div className="relative rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <img src={Logo} alt="Navodisha Logo" className="h-12 w-12 object-contain rounded-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Navodisha
                </h1>
                <p className="text-purple-200 font-medium">College Searching - Discover Your Future</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-white/80">
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Instructions</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          {/* Search Panel */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 sticky top-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Find Your Match</h2>
              </div>

              {/* Course Type Toggle */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-purple-200 mb-4">
                  Course Type
                </label>
                <div className="bg-white/5 rounded-xl p-1 grid grid-cols-3 gap-1">
                  <button
                    onClick={() => handleInputChange('courseType', 'engineering')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${form.courseType === 'engineering'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Engineering
                  </button>
                  <button
                    onClick={() => handleInputChange('courseType', 'pharmacy')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${form.courseType === 'pharmacy'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Pharmacy
                  </button>
                  <button
                    onClick={() => handleInputChange('courseType', 'nursing')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${form.courseType === 'nursing'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Nursing
                  </button>
                </div>

              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2">
                  {/* Search Method Toggle */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-4">
                      Search Method
                    </label>
                    <select
                      value={form.searchMethod}
                      onChange={(e) => handleInputChange('searchMethod', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                    >
                      <option value="percentile" className="bg-slate-800">Percentile</option>
                      <option value="rank" className="bg-slate-800">Merit Rank</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {/* Input Field */}
                  <div className="mb-8">
                    {form.searchMethod === 'rank' ? (
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-3">
                          Your Merit Rank
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Enter your rank"
                            value={form.rank}
                            onChange={(e) => handleInputChange('rank', e.target.value)}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            min="1"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <TrendingUp className="h-5 w-5 text-purple-400" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-3">
                          Your Percentile
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Enter percentile (0-100)"
                            value={form.percentile}
                            onChange={(e) => handleInputChange('percentile', e.target.value)}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <span className="text-purple-400 font-medium">%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2">
                  {/* Category Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-3">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-slate-800">Select Category</option>
                        {getCategoryOptions(form.courseType).map(category => (
                          <option key={category.value} value={category.value} className="bg-slate-800">
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Users className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    {selectedCategory && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedCategory.color}`}></div>
                        <span className="text-sm text-purple-200">{selectedCategory.label}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Branch Input - only for engineering */}
                {form.courseType === 'engineering' && (
                  <div className="w-full md:w-1/2">
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-purple-200 mb-3">
                        Branch (optional)
                      </label>
                      <div className="relative">
                        <select
                          value={form.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                        >
                          <option value="" className="bg-slate-800">Select Branch</option>
                          {branchOptions.map((branch) => (
                            <option key={branch} value={branch} className="bg-slate-800">
                              {branch}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <BookOpen className="h-5 w-5 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full md:w-1/2">
                  {/* City Input */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-purple-200 mb-3">
                      City (comma separated)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Pune, Mumbai"
                        value={form.cities}
                        onChange={(e) => handleInputChange('cities', e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <MapPin className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3 backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-fit px-6 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Find My Colleges</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {hasSearched ? 'Your College Matches' : 'Ready to Explore?'}
                </h2>
                {hasSearched && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {results.length} matches found
                  </div>
                )}
              </div>

              {!hasSearched ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-50"></div>
                    <div className="relative p-6 bg-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Your {form.courseType.toLocaleUpperCase()} Journey Starts Here
                  </h3>
                  <p className="text-purple-200 max-w-md mx-auto text-lg leading-relaxed">
                    Enter your exam details to discover the perfect {form.courseType.toLocaleUpperCase()} colleges tailored to your achievements.
                  </p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Searching Colleges...</h3>
                  <p className="text-purple-200 max-w-md mx-auto text-lg leading-relaxed">
                    Please wait while we find the best matches for you.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-50"></div>
                    <div className="relative p-6 bg-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-sm">
                      <AlertCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No Matches Found
                  </h3>
                  <p className="text-purple-200 max-w-md mx-auto text-lg leading-relaxed">
                    Try adjusting your search criteria or explore different categories to find more options.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((college, index) => (
                    <div
                      key={index}
                      className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <div className="relative p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-200 transition-colors">
                            {college.college}
                          </h3>
                          <div className="flex items-center space-x-2 text-purple-200">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">
                              {form.courseType === 'nursing' ? college.status : college.branch}
                            </span>
                          </div>

                          {/* Show level only for engineering */}
                          {form.courseType === 'engineering' && college.level && (
                            <div className="flex items-center space-x-2 text-blue-300 mt-2">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm font-medium">Level: {college.level}</span>
                            </div>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=" rounded-2xl w-[95vw] max-w-2xl p-4 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl relative">
        {
          showInstructions && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh] shadow-2xl relative">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-4 right-4 text-purple-600 hover:text-purple-900 font-bold text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-purple-700">🎓 Navodisha: College Search Tool – User Guide</h2>
                <div className="prose prose-purple max-w-none text-slate-800">
                  {/* You can use a markdown renderer like react-markdown for rich formatting, or paste your markdown as HTML below */}
                  <ol className="list-decimal pl-4 space-y-4">
                    <li>
                      <strong>Select Course Type:</strong> Engineering, Pharmacy, or Nursing.
                    </li>
                    <li>
                      <strong>Choose Your Search Method:</strong> Percentile or Merit Rank.
                    </li>
                    <li>
                      <strong>Enter Your Exam Details:</strong> Percentile (0–100) or Rank.
                    </li>
                    <li>
                      <strong>Select Your Category:</strong> Choose from the dropdown. Categories are color-coded.
                    </li>
                    <li>
                      <strong>(Optional) Filter by Branch:</strong> For Engineering only.
                    </li>
                    <li>
                      <strong>(Optional) Filter by City:</strong> Comma-separated city names.
                    </li>
                    <li>
                      <strong>Click "Find My Colleges":</strong> View your personalized results.
                    </li>
                  </ol>
                  <h3 className="mt-6 text-lg font-semibold text-purple-700">Understanding the Results</h3>
                  <ul className="list-disc pl-6">
                    <li>College Name, Branch/Status, and visual indicators for category and score match.</li>
                  </ul>
                  <h3 className="mt-6 text-lg font-semibold text-purple-700">No Results Found?</h3>
                  <ul className="list-disc pl-6">
                    <li>Broaden your search criteria</li>
                    <li>Double-check your percentile or rank</li>
                    <li>Try another eligible category</li>
                    <li>Remove city filters for more options</li>
                  </ul>
                  <h3 className="mt-6 text-lg font-semibold text-purple-700">Tips for Better Results</h3>
                  <ul className="list-disc pl-6">
                    <li>Be precise with your percentile or rank</li>
                    <li>Start with broad filters; refine later</li>
                    <li>Use branch filters only if you have a preference</li>
                    <li>Explore all course types if you're open to options</li>
                  </ul>
                  <h3 className="mt-6 text-lg font-semibold text-purple-700">How It Works</h3>
                  <ul className="list-disc pl-6">
                    <li>Standardized scoring of your rank/percentile</li>
                    <li>Historical cutoff analysis</li>
                    <li>Category-based reservation advantages</li>
                    <li>Applied filters (course, city, branch)</li>
                    <li>Eligibility comparison with all available colleges</li>
                  </ul>
                  <h3 className="mt-6 text-lg font-semibold text-purple-700">Need Help?</h3>
                  <ul className="list-disc pl-6">
                    <li>Refresh the page and re-enter your details</li>
                    <li>Double-check your entries</li>
                    <li>Contact us: Pranay Bhandekar- 7620149253</li>
                  </ul>
                  <p className="mt-6 text-purple-700 font-bold">🌟 We're here to help you find the perfect college match. Happy searching!</p>
                </div>
              </div>
            </div>
          )
        }
      </div>

    </div>


  );
}

export default App;
