import React from "react";
import { Route, Redirect} from "react-router-dom";

export default function AuthenticatedRoute({ children,authed, ...rest }) {
  // const { pathname, search } = useLocation();
  return (
    <Route {...rest}>
      {authed ? (
        children
      ) : (
        <Redirect to={
          `/login`
        } />
      )}
    </Route>
  );
}

// export default function AuthenticatedRoute ({component: Component, authed, ...rest}) {
//   return (
//     <Route
//       {...rest}
//       render={(props) => authed === true
//         ? <Component {...props} />
//         : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
//     />
//   )
// }