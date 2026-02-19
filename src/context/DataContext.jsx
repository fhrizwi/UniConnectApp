import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchDemoPosts } from "../api/posts";
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
  { id: "g1", name: "AI Builders", category: "Academic", members: 342, about: "Hands-on ML projects and paper reading sessions." },
  { id: "g2", name: "Campus Photography", category: "Hobby", members: 186, about: "Photo walks and editing workshops every weekend." },
  { id: "g3", name: "Placement Prep Circle", category: "Career", members: 510, about: "Mock interviews, resume reviews, and referrals." },
  { id: "g4", name: "Green Campus Club", category: "Community", members: 124, about: "Sustainability drives and zero-waste events." },
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
  },
  {
    id: "r2",
    company: "Nova Analytics",
    role: "Data Analyst",
    location: "Remote",
    referredBy: "Rahul Sen",
    status: "Open",
    note: "SQL + dashboarding experience preferred.",
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
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingPosts(true);
        const apiPosts = await fetchDemoPosts(16);
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
        setFeedError("Unable to load demo feed from JSONPlaceholder.");
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
    ({ title, content, imageUrl }) => {
      if (!user) {
        return null;
      }

      const newPost = {
        id: `local-${Date.now()}`,
        sourceId: null,
        userId: user.id,
        authorName: user.fullName,
        role: user.role,
        title: title || "Campus Update",
        content,
        imageUrl: imageUrl || `https://picsum.photos/seed/local-${Date.now()}/900/600`,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: Date.now(),
        fromApi: false,
      };

      setPosts((prev) => [newPost, ...prev]);
      pushNotification({
        type: "post",
        text: "Your post is now live in the UniConnect feed.",
      });

      return newPost;
    },
    [user, pushNotification],
  );

  const toggleLike = useCallback(
    (postId) => {
      if (!user) {
        return;
      }

      let becameLiked = false;

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          const liked = post.likedBy.includes(user.id);
          becameLiked = !liked;

          return {
            ...post,
            likes: liked ? Math.max(0, post.likes - 1) : post.likes + 1,
            likedBy: liked ? post.likedBy.filter((id) => id !== user.id) : [...post.likedBy, user.id],
          };
        }),
      );

      if (becameLiked) {
        pushNotification({
          type: "like",
          text: `${user.fullName} liked a post in your network.`,
        });
      }
    },
    [user, pushNotification],
  );

  const addComment = useCallback(
    (postId, text) => {
      if (!user || !text.trim()) {
        return;
      }

      const comment = {
        id: `c-${Date.now()}`,
        userId: user.id,
        authorName: user.fullName,
        text: text.trim(),
        createdAt: Date.now(),
      };

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post,
        ),
      );

      pushNotification({
        type: "comment",
        text: `${user.fullName} commented on a feed post.`,
      });
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
      };

      setReferrals((prev) => [nextReferral, ...prev]);
      pushNotification({
        type: "referral",
        text: `${user.fullName} posted a new alumni referral opportunity.`,
      });
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      users,
      posts,
      notifications,
      groups,
      referrals,
      analytics,
      loadingPosts,
      feedError,
      unreadCount,
      getUser,
      addPost,
      toggleLike,
      addComment,
      markAllNotificationsRead,
      addReferral,
      joinGroup,
    }),
    [
      users,
      posts,
      notifications,
      groups,
      referrals,
      analytics,
      loadingPosts,
      feedError,
      unreadCount,
      getUser,
      addPost,
      toggleLike,
      addComment,
      markAllNotificationsRead,
      addReferral,
      joinGroup,
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
