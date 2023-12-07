import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="columns is-centered">
      <div className="column is-6">
        <div className="box has-text-danger has-background-danger-light">
          <div className="block">
            <p className="title has-text-danger">Oops!</p>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          </div>
          <p><Link to="/" className="button is-danger">Return to main page</Link></p>
        </div>
      </div>
    </div>
  );
}