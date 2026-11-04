export type ServerType = {
  id: number;
  uuid: string;
  name: string;
  tags: ServerTagType[];
  rating: number;
  members: number;
  description: string;
  category: string;
  icon: string;
  banner: string;
  country: string;
  link: string;
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
};

export type ServerTagType = {
  server_uuid: string;
  tag_uuid: string;
  tag: TagType;
}

export type TagType = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
};

