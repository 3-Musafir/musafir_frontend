import { RecoilEnv, atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
export const currentUser = atom({
  key: 'currentUser',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const currentUserRoleState = selector({
  key: 'currentUserRoleState',
  get: ({ get }) => {
    const roles = get(currentUser).roles;
    return Array.isArray(roles) ? roles : [];
  },
});
