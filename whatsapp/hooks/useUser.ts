import { getMe } from "@/api/getMe";
import { login } from "@/api/login";
import { logOut } from "@/api/logout";
import { Action, UserEntry } from "@/app/app-context";
import { Dispatch, useEffect, useState } from "react";

export const useUser = (onUserLoaded: (user: UserEntry | null) => void, dispatch: Dispatch<Action>) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserEntry | null>(null);
  /** Callback used in log in form. */
  const onLogIn = (
    username = "",
    password = "",
    onError = (val = null as string | null ) => { },
    onLoading = (loading = false) => { }
  ) => {
    // onError(null);
    onLoading(true);
    login(username, password)
      .then((x) => {
        setUser(x);
      })
      .catch((e) => onError(e.message))
      .finally(() => onLoading(false));
  };

  /** Log out form */
  const onLogOut = async () => {
    logOut().then(() => {
      setUser(null);
      /** This will clear the store, to completely re-initialize an app on the next login. */
      dispatch({ type: "clear" });
      setLoading(true);
    });
  };

  /** Runs once when the component is mounted to check if there's user stored in cookies */
  useEffect(() => {
    if (!loading) {
      return;
    }
    getMe().then((user) => {
      setUser(user);
      setLoading(false);
      onUserLoaded(user);
    });
  }, [onUserLoaded, loading]);

  return { user, onLogIn, onLogOut, loading };
};