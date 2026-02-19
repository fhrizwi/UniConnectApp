import client from "./client";

const roleByUserId = {
  1: "student",
  2: "faculty",
  3: "alumni",
  4: "club",
  5: "student",
  6: "faculty",
  7: "alumni",
  8: "club",
  9: "student",
  10: "admin",
};

const nameByUserId = {
  1: "Aarav Mehta",
  2: "Dr. Nisha Rao",
  3: "Sana Khan",
  4: "Robotics Club",
  5: "Ishita Verma",
  6: "Prof. Daniel Roy",
  7: "Rahul Sen",
  8: "Literary Club",
  9: "Kabir Jain",
  10: "Admin Office",
};

export async function fetchDemoPosts(limit = 20) {
  const { data } = await client.get("/posts", { params: { _limit: limit } });

  return data.map((post) => ({
    id: `api-${post.id}`,
    sourceId: post.id,
    userId: `u${post.userId}`,
    authorName: nameByUserId[post.userId] || `Campus User ${post.userId}`,
    role: roleByUserId[post.userId] || "student",
    title: post.title,
    content: post.body,
    imageUrl: `https://picsum.photos/seed/uniconnect-${post.id}/900/600`,
    likes: Math.floor(Math.random() * 100) + 5,
    comments: [],
    likedBy: [],
    createdAt: Date.now() - post.id * 1000 * 60 * 35,
    fromApi: true,
  }));
}
