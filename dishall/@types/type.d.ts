export type ServerType = {
  id: number;
  uuid: string;
  name: string;
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
};

export type CategoryType = {
  id: number;
  name: string;
  icon: string;
  description: string;
  nb_user: number;
  nb_server: number;
};

export type ReviewType = {
  id: number;
  serverUuid: string;
  rate: number;
  comment: string;
  created_at: string;
  user: UserType;
};

export type ServerTagType = {
  server_uuid: string;
  tag_uuid: string;
  tag: TagType;
}

export type serverStatsType = {
  id: number;
  users_nb: number;
}

