import { useCallback, useMemo, useReducer } from 'react';
import { initialShrinkState, shrinkReducer } from '../components/reducers/ShrinkReducer';
import { ShrinkActionKind } from '../utils/types';

export default function useShrinkState({
  isLeftPanelExpanded,
  isRightPanelExpanded,
}: {
  isLeftPanelExpanded: boolean;
  isRightPanelExpanded: boolean;
}) {
  const [shrinkState, actiondispatcher] = useReducer(shrinkReducer, initialShrinkState);
  const expandRightPanel = useCallback(() => {
    actiondispatcher({ type: ShrinkActionKind.EXPANDRIGHTPANEL });
  }, []);
  const shrinkRightHandler = useCallback(() => {
    if (!shrinkState.shrinkrightpanel) {
      actiondispatcher({ type: ShrinkActionKind.SHRINKRIGHTPANEL });
    } else {
      actiondispatcher({ type: ShrinkActionKind.EXPANDRIGHTPANEL });
    }
  }, [shrinkState.shrinkrightpanel]);
  const expandLeftPanel = useCallback(() => {
    actiondispatcher({ type: ShrinkActionKind.EXPANDLEFTPANEL });
  }, []);
  const shrinkLeftHandler = useCallback(() => {
    if (!shrinkState.shrinkleftpanel) {
      actiondispatcher({ type: ShrinkActionKind.SHRINKLEFTPANEL });
    } else {
      actiondispatcher({ type: ShrinkActionKind.EXPANDLEFTPANEL });
    }
  }, [shrinkState.shrinkleftpanel]);
  const isResizeActive = useMemo(
    () =>
      !shrinkState.shrinkleftpanel && !shrinkState.shrinkrightpanel && !isLeftPanelExpanded && !isRightPanelExpanded,
    [shrinkState, isLeftPanelExpanded, isRightPanelExpanded]
  );
  const isLeftPanelOnlyShrinked = useMemo(
    () => shrinkState.shrinkleftpanel && !shrinkState.shrinkrightpanel,
    [shrinkState]
  );
  const isRightPanelOnlyShrinked = useMemo(
    () => shrinkState.shrinkrightpanel && !shrinkState.shrinkleftpanel,
    [shrinkState]
  );
  return {
    expandRightPanel,
    shrinkRightHandler,
    expandLeftPanel,
    shrinkLeftHandler,
    isResizeActive,
    isLeftPanelOnlyShrinked,
    isRightPanelOnlyShrinked,
    shrinkState,
  };
}
