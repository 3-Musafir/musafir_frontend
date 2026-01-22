import { RecoilEnv, atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
export const currentFlagship = atom({
  key: 'currentFlagship',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const filterFlagships = atom({
  key: 'filterFlagships',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
