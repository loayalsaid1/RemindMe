export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    username: (username: string) => ["users", "username", username] as const,
  },
  reminders: {
    all: ["reminders"] as const,
    mine: ["reminders", "mine"] as const,
    public: ["reminders", "public"] as const,
    user: (userId: string) => ["reminders", "user", userId] as const,
  },
  reflections: {
    all: ["reflections"] as const,
    byReminder: (id: string) => ["reflections", id] as const,
  },
};
