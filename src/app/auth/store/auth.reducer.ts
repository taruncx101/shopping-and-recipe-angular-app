import * as AuthActions from './auth.actions';
import { User } from './../user.model';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationdate
      );
      return {
        ...state,
        user
      };
      break;
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
      break;
    default:
      return state;
      break;
  }
}
