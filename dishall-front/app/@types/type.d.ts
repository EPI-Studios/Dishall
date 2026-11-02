export type ServerType = {
  id: number;
  name: string;
  tag: string;
  rating: number;
  members: number;
  description: string;
  category: string;
  guild_picture: string;
  guild_banner: string;
  country: string;
  inviteUrl: string;
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
  serverId: number;
  username: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}