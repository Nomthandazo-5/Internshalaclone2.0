import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectuser } from "@/Feature/Userslice";
import {
    Image as ImageIcon,
    Video,
    ThumbsUp,
    MessageCircle,
    Share2,
    Upload,
    Lock,
    Zap,
    Users,
    X,
} from "lucide-react";

interface Post {
    _id: string;
    user: any;
    content: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    likes: number;
    comments: { user: string; text: string }[];
    createdAt: string;
}

const PublicSpace = () => {
    const user = useSelector(selectuser);
    console.log("Current User from Redux:", user);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [friendCount, setFriendCount] = useState(0);
    const [postsToday, setPostsToday] = useState(0);
    const [isPosting, setIsPosting] = useState(false);
    const [caption, setCaption] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const getPostLimit = () => {
        if (friendCount > 10) return Infinity;
        if (friendCount >= 2) return 2;
        return 1;
    };

    const canPost = () => {
        const limit = getPostLimit();
        return postsToday < limit;
    };

    const getRemainingPosts = () => {
        const limit = getPostLimit();
        if (limit === Infinity) return "Unlimited";
        return Math.max(0, limit - postsToday);
    };
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("https://internshalaclone2-0-1.onrender.com/api/feed/all");
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching feed:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchUserStats = async () => {
            try {
                const res = await axios.get(
                    `https://internshalaclone2-0-1.onrender.com/api/feed/stats/${user._id}`
                );
                setFriendCount(res.data.friendCount);
                setPostsToday(res.data.postsToday);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        if (user?._id) {
            fetchPosts();
            fetchUserStats();
        }
    }, [user]);
    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async () => {
        if (!user || !user._id) {
            toast.error("You must be logged in to post.");
            return;
        }

        if (!canPost()) {
            toast.error(
                `Daily limit reached! You have used your quota (${getPostLimit() === Infinity ? 'Unlimited' : getPostLimit()} posts).`
            );
            return;
        }

        if (!mediaFile && !caption.trim()) {
            toast.error("Please add a caption or media.");
            return;
        }

        setIsPosting(true);
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("user", user._id);
        if (mediaFile) {
            formData.append("media", mediaFile);
        }

        try {
            const res = await axios.post(
                "https://internshalaclone2-0-1.onrender.com/api/feed/create",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success("Posted successfully!");
            setCaption("");
            setMediaFile(null);
            setMediaPreview(null);
            setPostsToday(postsToday + 1); setPosts([res.data, ...posts]);
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to create post");
            }
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await axios.put(`https://internshalaclone2-0-1.onrender.com/api/feed/like/${postId}`);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p));
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-black">Community Space</h1>
            {/* --- CREATE POST CARD --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-600">Create a Post</h2>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${canPost() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {canPost() ? <Zap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span>
                            Posts left today: <strong>{getRemainingPosts()}</strong>
                        </span>
                    </div>
                </div>

                <textarea
                    className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none mb-4 text-gray-900"
                    rows={3}
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />

                {mediaPreview && (
                    <div className="mb-4 relative w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        {mediaPreview.includes("video") ? (
                            <video src={mediaPreview} controls className="max-h-full max-w-full" />
                        ) : (
                            <img src={mediaPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                        )}
                        <button
                            onClick={() => {
                                setMediaFile(null);
                                setMediaPreview(null);
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                            <span>Photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleMediaChange} />
                        </label>
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                            <Video className="w-5 h-5 text-green-500" />
                            <span>Video</span>
                            <input type="file" accept="video/*" className="hidden" onChange={handleMediaChange} />
                        </label>
                    </div>
                    <button
                        onClick={handlePostSubmit}
                        disabled={isPosting || !canPost()}
                        className={`px-6 py-2 rounded-lg font-medium transition ${canPost() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isPosting ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {/* --- FEED --- */}
            <div className="space-y-2 py-10 text-gray-900">
                {loading ? (
                    <p>Loading feed...</p>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-900">
                        No posts yet. Be the first to share something!
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 flex items-center justify-between border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {/* Placeholder Avatar */}
                                        {post.user?.profileImage ? (
                                            <img src={post.user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                                                {post.user?.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            {post.user?.role === "recruiter" && <span className="text-blue-600 font-bold">Recruiter</span>}
                                            {post.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-gray-800 hover:text-black">•••</button>
                            </div>

                            {/* Post Content */}
                            <div className="p-4">
                                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                                {post.mediaUrl && (
                                    <div className="rounded-lg overflow-hidden bg-gray-100 mb-2">
                                        {post.mediaType === "video" ? (
                                            <video src={post.mediaUrl} controls className="w-full max-h-125" />
                                        ) : (
                                            <img src={post.mediaUrl} alt="Post Media" className="w-full max-h-125 object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="px-4 py-2 bg-gray-50 flex items-center justify-between border-t">
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
                                >
                                    <ThumbsUp className={`w-5 h-5 ${post.likes > 0 ? "text-blue-600 fill-blue-200" : ""}`} />
                                    <span>{post.likes} Likes</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-lg transition text-gray-600">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Comment</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-lg transition text-gray-600">
                                    <Share2 className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PublicSpace;