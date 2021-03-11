import type Record from "airtable/lib/record";

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
interface Image {
  filename: string;
  id: string;
  size: number;
  thumbnails: {
    full: Thumbnail;
    large: Thumbnail;
    small: Thumbnail;
  };
  type: string;
  url: string;
}

interface AirtableRecord<T> {
  fields: T;
  createdTime?: string;
  id: string;
}

type PlantField = {
  Name?: string;
  "Last Watered"?: string;
  Images?: Image[];
  Status?: "Alive" | "Sad" | "Dead";
  Notes?: string;
};
