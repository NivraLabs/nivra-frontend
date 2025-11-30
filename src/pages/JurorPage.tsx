import { JSX } from "react";
import JurorInbox from "../components/JurorInbox";
import PageActions from "../components/PageActions";

export default function JurorPage(): JSX.Element {
  return (
    <>
      <PageActions />
      <div className="container" style={{ paddingTop: 8 }}>
        <h2>Juror Inbox</h2>
        <JurorInbox />
      </div>
    </>
  );
}
