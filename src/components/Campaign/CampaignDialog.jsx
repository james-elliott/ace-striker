"use client";

// This components handles the review dialog and uses a next.js feature known as Server Actions to handle the form submission

import { useEffect, useLayoutEffect, useRef } from "react";
import { handleCampaignDialogSubmission } from "./actions.js";

const CampaignDialog = ({
  isOpen,
  handleClose,
  campaign,
  onChange,
  userId,
}) => {
  const dialog = useRef();

  // dialogs only render their backdrop when called with `showModal`
  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  const handleClick = (e) => {
    // close if clicked outside the modal
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialog} onMouseDown={handleClick}>
      <form
        action={handleCampaignDialogSubmission}
        onSubmit={() => {
          handleClose();
        }}
      >
        <header>
          <h3>New Campaign</h3>
        </header>
        <article>

          <p>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name this campaign"
              required
              value={campaign.name}
              onChange={(e) => onChange(e.target.value, "name")}
            />
          </p>

          <p>
            <input
              type="text"
              name="startingBV"
              id="startingBV"
              placeholder="Set a maximum BV to start the campaign"
              required
              value={campaign.startingBV}
              onChange={(e) => onChange(e.target.value, "startingBV")}
            />
          </p>
          <p>
            <input
              type="text"
              name="startingSP"
              id="startingSP"
              placeholder="Set the initial Supply Points you will have"
              required
              value={campaign.startingSP}
              onChange={(e) => onChange(e.target.value, "startingSP")}
            />
          </p>
          <p>
            <select id="difficulty"
              defaultValue={1.0}
              name="difficulty"
              onChange={(e) => onChange(e.target.value, "difficulty")}
              >
              <option value={1.2}>Rookie</option>
              <option value={1.0}>Standard</option>
              <option value={0.9}>Veteran</option>
              <option value={0.8}>Elite</option>
              <option value={0.7}>Legendary</option>
            </select>
          </p>

          <input type="hidden" name="userId" value={userId} />
        </article>
        <footer>
          <menu>
            <button
              autoFocus
              type="reset"
              onClick={handleClose}
              className="button--cancel"
            >
              Cancel
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Submit
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default CampaignDialog;
