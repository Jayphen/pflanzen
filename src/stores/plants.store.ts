import { Writable, writable } from "svelte/store";
import type { AirtableRecord, PlantField } from "../airtable";

type PlantMap = Map<string, AirtableRecord<PlantField>>;
export type PlantsStore = Writable<PlantMap> & {
  patch: (plant: AirtableRecord<PlantField>) => void;
};

export const initPlantsStore = (data: AirtableRecord<PlantField>[]) => {
  const store = writable(new Map(data.map((plant) => [plant.id, plant])));

  return {
    subscribe: store.subscribe,
    update: store.update,
    set: store.set,
    patch: (plant: AirtableRecord<PlantField>) => {
      let _initial: PlantMap;

      store.update(($plants) => {
        _initial = new Map($plants);

        $plants.delete(plant.id);
        $plants.set(plant.id, plant);
        return $plants;
      });

      return { undo: _initial };
    },
  };
};

export const plantsContext = {};
