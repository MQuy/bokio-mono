import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@mono/elements/Button/Button";
import { Link } from "./Link";

const App = () => (
  <div>
    Hello world <Button />
    <Link />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
