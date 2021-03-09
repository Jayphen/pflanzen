import { Writable, writable } from "svelte/store";
import type { AirtableRecord, PlantField } from "../airtable";

export type PlantsStore = Writable<Map<string, AirtableRecord<PlantField>>> & {
  patch: (plant: AirtableRecord<PlantField>) => void;
};

export const initPlantsStore = (data: AirtableRecord<PlantField>[]) => {
  const store = writable(new Map(data.map((plant) => [plant.id, plant])));

  return {
    subscribe: store.subscribe,
    update: store.update,
    patch: (plant: AirtableRecord<PlantField>) => {
      store.update(($plants) => {
        $plants.delete(plant.id);
        $plants.set(plant.id, plant);
        return $plants;
      });
    },
  };
};

export const plantsContext = {};
