import { create } from 'zustand';

const useStore = create(() => ({
  hasSwUpdateReady: false
}));

export default useStore;
