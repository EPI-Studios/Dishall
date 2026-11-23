export type ServerType = {
  uuid: string;
  name: string;
  guild_id: string;
  tags: string[];
  serverStats: serverStatsType;
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
  owner: boolean;
  created_at: Date;
};

export type UserType = {
  id: number;
  discord_id: string;
  avatar: string;
  pseudo: string;
  role: string;
}

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  nb_user: number;
  nb_server: number;
};

export type ReviewType = {
  id: number;
  uuid: string
  serverUuid: string;
  rate: number;
  status: string;
  comment: string;
  created_at: string;
  user: UserType | null;
};

export type ServerTagType = {
  server_uuid: string;
  tag_uuid: string;
  tag: TagType;
}

export type serverStatsType = {
  id: number;
  users_nb: number;
  server_bump: string;
  last_bump_at: string;
}

export type RoleType = "member" | "moderator";


