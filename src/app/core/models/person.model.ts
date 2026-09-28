export interface PersonListItem {
  id: number;
  name: string;
  profileUrl: string | null;
}

export interface PersonList {
  results: PersonListItem[];
}
