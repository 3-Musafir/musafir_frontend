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
    const user = get(currentUser) as any;
    const roles =
      user?.roles ||
      user?.data?.roles; // tolerate wrapped /user/me responses
    return Array.isArray(roles) ? roles : [];
  },
});
