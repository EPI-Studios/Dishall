export type ServerType = {
  uuid: string;
  name: string;
  guild_id: string;
  tags: string[];
  serverStats?: serverStatsType;
  rating: number;
  reviewCount: number;
  members: number;
  description: string;
  category: string;
  icon: string;
  banner: string;
  country: string;
  link: string;
  bumped: boolean;
  owner?: boolean;
  created_at: Date;
  status?: string;
  score: number
};

export type UserType = {
  discord_id: string;
  avatar: string;
  pseudo: string;
  role: string;
}

export type CategoryType = {
  name: string;
  slug: string;
  icon: string;
  description: string;
  nb_user: number;
  nb_server: number;
};

export type ReviewType = {
  uuid: string;
  rate: number;
  comment: string;
  created_at: string;
  user: { pseudo: string; avatar: string } | null;
};

export type ServerTagType = {
  server_uuid: string;
  tag_uuid: string;
  tag: TagType;
}

export type serverStatsType = {
  users_nb: number;
  server_bump: string;
  last_bump_at: string;
}

export type RoleType = "member" | "moderator";


