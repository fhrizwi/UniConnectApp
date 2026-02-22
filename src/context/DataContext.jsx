import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { mockAPI } from "../api/mockApi";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

const campusUsers = [
  { id: "u1", fullName: "Aarav Mehta", role: "student", department: "Computer Science", year: "3rd Year" },
  { id: "u2", fullName: "Dr. Nisha Rao", role: "faculty", department: "Electronics", year: "Faculty" },
  { id: "u3", fullName: "Sana Khan", role: "alumni", department: "Mechanical", year: "Class of 2021" },
  { id: "u4", fullName: "Robotics Club", role: "club", department: "Student Affairs", year: "Club" },
  { id: "u5", fullName: "Ishita Verma", role: "student", department: "Biotech", year: "2nd Year" },
  { id: "u10", fullName: "Admin Office", role: "admin", department: "Administration", year: "Admin" },
].map((u) => ({
  ...u,
  username: u.fullName.toLowerCase().replace(/\s+/g, "."),
  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`,
}));

const seedNotifications = [
  {
    id: "n-1",
    type: "system",
    text: "Welcome to UniConnect. Explore your department groups and alumni board.",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

const groupSeed = [
  { 
    id: "g1", 
    name: "AI Builders", 
    category: "Academic", 
    members: 342, 
    about: "Hands-on ML projects and paper reading sessions.", 
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    participationType: "both", // "individual", "team", "both"
    teamSize: { min: 1, max: 5 },
    isFree: true,
    price: "Free",
    organizer: "Computer Science Department",
    requirements: "Basic Python knowledge required. Open to all students interested in AI/ML.",
    tags: ["AI", "Machine Learning", "Projects", "Research"],
    meetingSchedule: "Every Friday 4:00 PM - 6:00 PM",
    mode: "Hybrid" // "Online", "Offline", "Hybrid"
  },
  { 
    id: "g2", 
    name: "Campus Photography", 
    category: "Hobby", 
    members: 186, 
    about: "Photo walks and editing workshops every weekend.", 
    cover: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    participationType: "individual",
    teamSize: { min: 1, max: 1 },
    isFree: true,
    price: "Free",
    organizer: "Media Club",
    requirements: "Any student with interest in photography. Camera optional.",
    tags: ["Photography", "Art", "Creative", "Weekend"],
    meetingSchedule: "Saturday & Sunday 8:00 AM - 10:00 AM",
    mode: "Offline"
  },
  { 
    id: "g3", 
    name: "Placement Prep Circle", 
    category: "Career", 
    members: 510, 
    about: "Mock interviews, resume reviews, and referrals.", 
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    participationType: "individual",
    teamSize: { min: 1, max: 1 },
    isFree: false,
    price: "₹50 per semester",
    organizer: "Training & Placement Cell",
    requirements: "Open to all final year students. Must bring updated resume.",
    tags: ["Career", "Placement", "Interview", "Professional"],
    meetingSchedule: "Wednesday 6:00 PM - 8:00 PM",
    mode: "Hybrid"
  },
  { 
    id: "g4", 
    name: "Green Campus Club", 
    category: "Community", 
    members: 124, 
    about: "Sustainability drives and zero-waste events.", 
    cover: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    participationType: "team",
    teamSize: { min: 3, max: 8 },
    isFree: true,
    price: "Free",
    organizer: "Student Affairs Council",
    requirements: "Teams of 3-8 students. Must attend monthly planning meetings.",
    tags: ["Environment", "Sustainability", "Community", "Social Work"],
    meetingSchedule: "First Monday of every month 5:00 PM - 6:00 PM",
    mode: "Offline"
  },
];

const storySeed = [
  { id: "s1", userId: "u1", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400", createdAt: Date.now() - 3600000 },
  { id: "s2", userId: "u2", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400", createdAt: Date.now() - 7200000 },
  { id: "s3", userId: "u3", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400", createdAt: Date.now() - 10800000 },
  { id: "s4", userId: "u4", imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400", createdAt: Date.now() - 14400000 },
];

const eventSeed = [
  { 
    id: "e1", 
    title: "Tech Fest 2026", 
    date: "Mar 15", 
    endDate: "Mar 17",
    startTime: "10:00 AM",
    endTime: "6:00 PM",
    location: "Main Auditorium", 
    attendees: 420, 
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", 
    participants: [], 
    online: true,
    offline: true,
    mode: "Hybrid",
    organizer: "Computer Science Department",
    description: "Annual technology festival featuring workshops, competitions, and guest lectures from industry experts.",
    criteria: "Open to all students. Basic programming knowledge preferred for technical workshops.",
    isFree: true,
    price: "Free",
    tags: ["Technology", "Workshop", "Competition", "Guest Lecture"],
    participationType: "both", // "individual", "team", "both"
    teamSize: { min: 1, max: 4 }
  },
  { 
    id: "e2", 
    title: "Career Fair", 
    date: "Mar 22", 
    endDate: "Mar 22",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    location: "Sports Complex", 
    attendees: 850, 
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400", 
    participants: [], 
    online: true,
    offline: true,
    mode: "Hybrid",
    organizer: "Placement Cell",
    description: "Connect with top companies and explore internship and job opportunities. Resume reviews and on-the-spot interviews.",
    criteria: "All students welcome. Bring updated resume and dress professionally.",
    isFree: true,
    price: "Free",
    tags: ["Career", "Placement", "Networking", "Interview"],
    participationType: "individual",
    teamSize: { min: 1, max: 1 }
  },
  { 
    id: "e3", 
    title: "Hackathon Finals", 
    date: "Apr 5", 
    endDate: "Apr 6",
    startTime: "6:00 PM",
    endTime: "6:00 PM",
    location: "CS Block", 
    attendees: 120, 
    cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400", 
    participants: [], 
    online: false,
    offline: true,
    mode: "Offline",
    organizer: "Coding Club",
    description: "48-hour coding competition to build innovative solutions. Prizes worth ₹50,000 to be won.",
    criteria: "Teams of 2-4 students. Programming skills required. Register by March 25.",
    isFree: false,
    price: "₹100 per team",
    tags: ["Coding", "Competition", "Hackathon", "Prizes"],
    participationType: "team",
    teamSize: { min: 2, max: 4 }
  },
];

const hashtagSeed = [
  { tag: "CampusLife", count: 1240 },
  { tag: "Placement2026", count: 892 },
  { tag: "TechFest", count: 654 },
  { tag: "AlumniConnect", count: 421 },
  { tag: "StudyGroup", count: 380 },
];

const referralSeed = [
  {
    id: "r1",
    company: "Infospark",
    role: "Frontend Intern",
    location: "Bengaluru",
    referredBy: "Sana Khan",
    status: "Open",
    note: "Strong React and DSA basics required.",
    eligibilityCriteria: "3rd/4th year CSE/IT, React & DSA basics. CGPA ≥ 7.5.",
    applicants: [],
  },
  {
    id: "r2",
    company: "Nova Analytics",
    role: "Data Analyst",
    location: "Remote",
    referredBy: "Rahul Sen",
    status: "Open",
    note: "SQL + dashboarding experience preferred.",
    eligibilityCriteria: "Any year, SQL & Excel. Prior projects preferred.",
    applicants: [],
  },
];

const analyticsSeed = {
  activeUsers: 1420,
  postsToday: 126,
  engagementRate: 72,
  newGroups: 6,
  roleDistribution: [
    { role: "Student", count: 980 },
    { role: "Faculty", count: 122 },
    { role: "Alumni", count: 216 },
    { role: "Club", count: 84 },
    { role: "Admin", count: 18 },
  ],
};

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [users, setUsers] = useState(campusUsers);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [groups, setGroups] = useState(groupSeed);
  const [referrals, setReferrals] = useState(referralSeed);
  const [analytics] = useState(analyticsSeed);
  const [stories, setStories] = useState(storySeed);
  const [events, setEvents] = useState(eventSeed);
  const [hashtags] = useState(hashtagSeed);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [userConnections, setUserConnections] = useState({}); // Track user connections

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingPosts(true);
        const apiPosts = await mockAPI.getPosts(20);
        if (!mounted) {
          return;
        }

        setPosts(apiPosts);

        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const inferred = apiPosts
            .map((p) => ({
              id: p.userId,
              fullName: p.authorName,
              role: p.role,
              department: "General",
              year: p.role === "faculty" ? "Faculty" : p.role === "alumni" ? "Alumni" : "Member",
              username: p.authorName.toLowerCase().replace(/\s+/g, "."),
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.authorName)}`,
            }))
            .filter((u) => !existingIds.has(u.id));

          return [...prev, ...inferred];
        });
      } catch {
        if (!mounted) {
          return;
        }
        setFeedError("Unable to load feed from mock API.");
      } finally {
        if (mounted) {
          setLoadingPosts(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) {
        return prev.map((u) => (u.id === user.id ? { ...u, ...user } : u));
      }
      return [{ ...user }, ...prev];
    });
  }, [user]);

  const getUser = useCallback(
    (userId) => {
      if (user && user.id === userId) {
        return user;
      }
      return users.find((u) => u.id === userId);
    },
    [users, user],
  );

  const pushNotification = useCallback((payload) => {
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        read: false,
        createdAt: Date.now(),
        ...payload,
      },
      ...prev,
    ]);
  }, []);

  const addPost = useCallback(
    async ({ title, content, imageUrl, isTweet }) => {
      if (!user) {
        return null;
      }

      try {
        const postData = {
          userId: user.id,
          authorName: user.fullName,
          role: user.role,
          title: title || "Campus Update",
          content,
          imageUrl: isTweet ? "" : (imageUrl || `https://picsum.photos/seed/local-${Date.now()}/900/600`),
          hashtags: content.match(/#\w+/g)?.map(tag => tag.substring(1)) || []
        };

        const newPost = await mockAPI.createPost(postData);
        
        // Update local state to trigger re-render
        setPosts(prev => [newPost, ...prev]);
        
        pushNotification({
          type: "post",
          text: "Your post is now live in the UniConnect feed.",
        });

        return newPost;
      } catch (error) {
        console.error("Failed to create post:", error);
        pushNotification({
          type: "error",
          text: "Failed to create post. Please try again.",
        });
        return null;
      }
    },
    [user, pushNotification],
  );

  const toggleLike = useCallback(
    async (postId) => {
      if (!user) {
        return;
      }

      try {
        const result = await mockAPI.toggleLike(postId, user.id);
        
        // Update local state to reflect the change
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id !== postId) {
              return post;
            }

            return {
              ...post,
              likes: result.likes,
              likedBy: result.liked ? [...post.likedBy, user.id] : post.likedBy.filter((id) => id !== user.id),
            };
          }),
        );

        if (result.liked) {
          pushNotification({
            type: "like",
            text: `${user.fullName} liked a post in your network.`,
            navigation: {
              type: "post",
              postId: postId
            }
          });
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
      }
    },
    [user, pushNotification],
  );

  const addComment = useCallback(
    async (postId, text) => {
      if (!user || !text.trim()) {
        return;
      }

      try {
        const commentData = {
          userId: user.id,
          authorName: user.fullName,
          text: text.trim(),
        };

        const newComment = await mockAPI.addComment(postId, commentData);
        
        // Update local state to reflect the change
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post,
          ),
        );

        pushNotification({
          type: "comment",
          text: `${user.fullName} commented on a feed post.`,
        });
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    },
    [user, pushNotification],
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addReferral = useCallback(
    (referral) => {
      if (!user) {
        return;
      }

      const nextReferral = {
        id: `r-${Date.now()}`,
        ...referral,
        referredBy: user.fullName,
        status: "Open",
        applicants: [],
      };

      setReferrals((prev) => [nextReferral, ...prev]);
      pushNotification({
        type: "referral",
        text: `${user.fullName} posted a new alumni referral opportunity.`,
      });
    },
    [user, pushNotification],
  );

  const participateEvent = useCallback(
    (eventId) => {
      if (!user) return;
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, participants: e.participants?.includes(user.id) ? (e.participants || []).filter((id) => id !== user.id) : [...(e.participants || []), user.id] }
            : e,
        ),
      );
    },
    [user],
  );

  const applyToReferral = useCallback(
    (referralId) => {
      if (!user) return;
      setReferrals((prev) =>
        prev.map((r) =>
          r.id === referralId ? { ...r, applicants: r.applicants?.includes(user.id) ? r.applicants : [...(r.applicants || []), user.id] } : r,
        ),
      );
      pushNotification({ type: "referral", text: `You applied to a job referral.` });
    },
    [user, pushNotification],
  );

  const joinGroup = useCallback(
    (groupId) => {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, members: group.members + 1 } : group,
        ),
      );

      pushNotification({
        type: "group",
        text: "You joined a campus community group.",
      });
    },
    [pushNotification],
  );

  // Connection/Follow functionality
  const connectUser = useCallback(
    (targetUserId) => {
      if (!user || user.id === targetUserId) return;

      setUserConnections((prev) => {
        const currentConnections = prev[user.id] || [];
        const targetConnections = prev[targetUserId] || [];
        const isConnected = currentConnections.includes(targetUserId);
        
        if (isConnected) {
          // Disconnect - remove from both users
          return {
            ...prev,
            [user.id]: currentConnections.filter((id) => id !== targetUserId),
            [targetUserId]: targetConnections.filter((id) => id !== user.id),
          };
        } else {
          // Connect - add to both users
          const targetUser = users.find((u) => u.id === targetUserId);
          pushNotification({
            type: "connection",
            text: `You are now connected with ${targetUser?.fullName || 'a user'}.`,
            navigation: {
              type: "profile",
              userId: targetUserId
            }
          });
          return {
            ...prev,
            [user.id]: [...currentConnections, targetUserId],
            [targetUserId]: [...targetConnections, user.id],
          };
        }
      });
    },
    [user, users, pushNotification],
  );

  const isUserConnected = useCallback(
    (targetUserId) => {
      if (!user) return false;
      return (userConnections[user.id] || []).includes(targetUserId);
    },
    [user, userConnections],
  );

  const getConnectedUsers = useCallback(
    () => {
      if (!user) return [];
      const connectedIds = userConnections[user.id] || [];
      return users.filter((u) => connectedIds.includes(u.id));
    },
    [user, userConnections, users],
  );

  const getSuggestedUsers = useCallback(
    () => {
      if (!user) return [];
      const connectedIds = userConnections[user.id] || [];
      return users.filter((u) => u.id !== user.id && !connectedIds.includes(u.id));
    },
    [user, userConnections, users],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      users,
      posts,
      notifications,
      groups,
      referrals,
      analytics,
      stories,
      events,
      hashtags,
      loadingPosts,
      feedError,
      unreadCount,
      userConnections,
      getUser,
      addPost,
      toggleLike,
      addComment,
      markAllNotificationsRead,
      addReferral,
      joinGroup,
      participateEvent,
      applyToReferral,
      connectUser,
      isUserConnected,
      getConnectedUsers,
      getSuggestedUsers,
    }),
    [
      users,
      posts,
      notifications,
      groups,
      referrals,
      analytics,
      stories,
      events,
      hashtags,
      loadingPosts,
      feedError,
      unreadCount,
      userConnections,
      getUser,
      addPost,
      toggleLike,
      addComment,
      markAllNotificationsRead,
      addReferral,
      joinGroup,
      participateEvent,
      applyToReferral,
      connectUser,
      isUserConnected,
      getConnectedUsers,
      getSuggestedUsers,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }

  return context;
}
