export interface Concert {
  id: string;
  title: string;
  venue: string;
  date: string;
  tag: string;
  gradient: string;
  poster?: string;
}

export interface Ticket {
  name: string;
  url: string;
}