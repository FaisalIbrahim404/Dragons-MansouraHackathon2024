import { create } from "zustand";

const useServicesStore = create((set) => ({
  services: [],
  setServices: (services) => set({ services }),
}));

export default useServicesStore;