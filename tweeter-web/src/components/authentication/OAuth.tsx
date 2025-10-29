import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../hooks/MessageHooks";

interface Props {
  icon: [IconPrefix, IconName];
  displayMessage: string;
  tooltipID: string;
  tooltipText: string;
}
const OAuth = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(
      message,
      3000,
      "text-white bg-primary"
    );
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() => displayInfoMessageWithDarkBackground(props.displayMessage)}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={props.tooltipID}>{props.tooltipText}</Tooltip>}
      >
        <FontAwesomeIcon icon={props.icon} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;
