import { Writable, writable, derived } from "svelte/store";
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
      // optimistically update the plant list
      store.update(($plants) => {
        $plants.delete(plant.id);
        $plants.set(plant.id, plant);
        return $plants;
      });
    },
    filter: (term: string) =>
      derived(store, ($plants) => {
        const _filtered = [...$plants.values()].filter((plant) =>
          plant.fields.Name.toLowerCase().includes(term.toLowerCase())
        );

        return {
          plants: new Map(_filtered.map((plant) => [plant.id, plant])),
          filtering: term !== "",
        };
      }),
  };
};

export const plantsContext = {};
