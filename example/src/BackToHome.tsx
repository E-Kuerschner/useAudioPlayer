import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface BackToHomeProps {
  className?: string;
}

export const BackToHome: FunctionComponent<BackToHomeProps> = (props) => {
  return (
    <Link className={props.className || ""} to="/">
      {"< -"} Example Select
    </Link>
  );
};
