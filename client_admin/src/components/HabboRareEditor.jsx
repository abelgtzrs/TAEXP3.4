import React, { useState, useEffect } from "react";
import { Search, Save, Edit3, Eye, AlertCircle, Check, X, Image as ImageIcon } from "lucide-react";
import Widget from "./dashboard/Widget";

const HabboRareEditor = () => {
  const [habboRares, setHabboRares] = useState([]);
  const [filteredRares, setFilteredRares] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rarity: "",
    category: "",
    imageUrl: "",
    tags: [],
    isActive: true,
  });

  // Fetch all Habbo Rares
  useEffect(() => {
    fetchHabboRares();
  }, []);

  // Filter rares based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = habboRares.filter(
        (rare) =>
          (rare.name && rare.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (rare.category && rare.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (rare.rarity && rare.rarity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRares(filtered);
    } else {
      setFilteredRares(habboRares);
    }
  }, [searchTerm, habboRares]);

  const fetchHabboRares = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/habbo-rares", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Habbo Rares");
      }

      const data = await response.json();
      setHabboRares(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching Habbo Rares:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (rare) => {
    setEditingItem(rare._id);
    setFormData({
      name: rare.name || "",
      description: rare.description || "",
      rarity: rare.rarity || "",
      category: rare.category || "",
      imageUrl: rare.imageUrl || "",
      tags: rare.tags || [],
      isActive: rare.isActive !== undefined ? rare.isActive : true,
    });
    setSaveStatus(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      rarity: "",
      category: "",
      imageUrl: "",
      tags: [],
      isActive: true,
    });
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");

      const response = await fetch(`http://localhost:5000/api/admin/habbo-rares/${editingItem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const updatedRare = await response.json();

      // Update local state
      setHabboRares((prevRares) => prevRares.map((rare) => (rare._id === editingItem ? updatedRare : rare)));

      setSaveStatus("success");
      setTimeout(() => {
        setEditingItem(null);
        setSaveStatus(null);
      }, 1500);
    } catch (err) {
      setSaveStatus("error");
      console.error("Error saving Habbo Rare:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (value) => {
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;

    // Use the same URL construction as DisplayedCollection
    const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

    // Remove leading 'public/' or '/public/' if present
    let cleanedUrl = imageUrl.replace(/^public\//, "").replace(/^\/public\//, "");
    // Remove leading slash if present
    cleanedUrl = cleanedUrl.replace(/^\//, "");

    const finalUrl = `${serverBaseUrl}/${cleanedUrl}`;

    // Debug logging to compare with DisplayedCollection
    console.log("HabboRareEditor URL Debug:", {
      originalImageUrl: imageUrl,
      cleanedUrl,
      serverBaseUrl,
      finalUrl,
    });

    return finalUrl;
  };

  const testImageLoad = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = getImageUrl(imageUrl);
    });
  };

  const ImagePreview = ({ imageUrl, name }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fullUrl = getImageUrl(imageUrl);

    useEffect(() => {
      if (imageUrl) {
        testImageLoad(imageUrl).then((loaded) => {
          setImageLoaded(loaded);
          setImageError(!loaded);
        });
      }
    }, [imageUrl]);

    return (
      <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={fullUrl}
              alt={name}
              className={`max-w-full max-h-full object-contain ${imageLoaded ? "opacity-100" : "opacity-50"}`}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageLoaded(false);
                setImageError(true);
              }}
            />
            {imageError && (
              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            )}
          </>
        ) : (
          <ImageIcon className="w-8 h-8 text-text-tertiary" />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Habbo Rare Editor</h1>
        <p className="text-text-secondary">Manage and edit Habbo Rare items with live image preview</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, category, or rarity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-text-secondary">
        Showing {filteredRares.length} of {habboRares.length} items
      </div>

      {/* Items list */}
      <div className="space-y-4">
        {filteredRares.map((rare) => (
          <Widget key={rare._id} title={rare.name}>
            {editingItem === rare._id ? (
              // Edit mode
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Rarity</label>
                        <select
                          value={formData.rarity}
                          onChange={(e) => handleInputChange("rarity", e.target.value)}
                          className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                        >
                          <option value="">Select rarity</option>
                          <option value="common">Common</option>
                          <option value="uncommon">Uncommon</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                        >
                          <option value="">Select category</option>
                          <option value="furniture">Furniture</option>
                          <option value="decoration">Decoration</option>
                          <option value="lighting">Lighting</option>
                          <option value="plant">Plant</option>
                          <option value="trophy">Trophy</option>
                          <option value="electronic">Electronic</option>
                          <option value="misc">Miscellaneous</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                        placeholder="e.g., habborares/classic/blue_amber_lamp.png"
                        className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags.join(", ")}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="vintage, blue, lamp, lighting"
                        className="w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange("isActive", e.target.checked)}
                        className="w-4 h-4 text-accent-primary border-border-primary rounded focus:ring-accent-primary"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-text-secondary">
                        Active
                      </label>
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">Live Preview</h3>

                    <div className="bg-background-tertiary p-4 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <ImagePreview imageUrl={formData.imageUrl} name={formData.name} />

                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{formData.name || "Untitled Item"}</h4>
                          <p className="text-sm text-text-secondary mt-1">{formData.description || "No description"}</p>

                          <div className="flex items-center space-x-4 mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                formData.rarity === "legendary"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : formData.rarity === "epic"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : formData.rarity === "rare"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : formData.rarity === "uncommon"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              {formData.rarity || "No rarity"}
                            </span>

                            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs font-medium">
                              {formData.category || "No category"}
                            </span>
                          </div>

                          {formData.tags.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {formData.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-accent-primary/20 text-accent-primary-light rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image debug info */}
                      <div className="mt-4 p-3 bg-background-primary rounded border border-border-primary">
                        <p className="text-xs text-text-secondary mb-1">Debug Info:</p>
                        <p className="text-xs text-text-tertiary font-mono break-all">
                          Full URL: {getImageUrl(formData.imageUrl)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border-primary">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-text-secondary bg-background-tertiary hover:bg-background-hover rounded-md transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                    className="px-4 py-2 bg-accent-primary text-white hover:bg-accent-primary-dark rounded-md transition-colors flex items-center disabled:opacity-50"
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                        Saving...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center space-x-4">
                <ImagePreview imageUrl={rare.imageUrl} name={rare.name} />

                <div className="flex-1">
                  <p className="text-sm text-text-secondary">{rare.description}</p>

                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rare.rarity === "legendary"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : rare.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-300"
                          : rare.rarity === "rare"
                          ? "bg-blue-500/20 text-blue-300"
                          : rare.rarity === "uncommon"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {rare.rarity}
                    </span>

                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs font-medium">
                      {rare.category}
                    </span>

                    {!rare.isActive && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(rare)}
                  className="p-2 text-text-secondary hover:text-accent-primary hover:bg-background-hover rounded-md transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            )}
          </Widget>
        ))}
      </div>

      {filteredRares.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No items found</h3>
          <p className="text-text-secondary">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default HabboRareEditor;
