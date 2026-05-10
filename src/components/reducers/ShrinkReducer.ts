import { ShrinkAction, ShrinkState } from '../../utils/types';

export const initialShrinkState = {
  shrinkleftpanel: false,
  shrinkrightpanel: false,
};
export function shrinkReducer(state: ShrinkState, action: ShrinkAction) {
  const { shrinkrightpanel, shrinkleftpanel } = state;
  switch (action.type) {
    case 'SHRINKLEFTPANEL':
      if (shrinkleftpanel === false && shrinkrightpanel == true) {
        return { shrinkrightpanel: false, shrinkleftpanel: true };
      }
      return { ...state, shrinkleftpanel: true };
    case 'SHRINKRIGHTPANEL':
      if (shrinkrightpanel === false && shrinkleftpanel == true) {
        return { shrinkrightpanel: true, shrinkleftpanel: false };
      }
      return { ...state, shrinkrightpanel: true };
    case 'EXPANDLEFTPANEL':
      return { ...state, shrinkleftpanel: false };
    case 'EXPANDRIGHTPANEL':
      return { ...state, shrinkrightpanel: false };
    default:
      return state;
  }
}
