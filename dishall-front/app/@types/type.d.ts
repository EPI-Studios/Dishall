export type ServerType = {
  id: number;
  name: string;
  tag: string;
  rating: number;
  members: number;
  description: string;
};

export type CategoryType = {
  name: string;
  icon: string;
  description: string;
  nb_user: number;
  nb_server: number;
}