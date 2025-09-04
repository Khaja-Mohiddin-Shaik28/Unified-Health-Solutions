import { useEffect } from "react";

function useEnterNavigation() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const focusable = Array.from(
          document.querySelectorAll(
            "input, select, textarea"
          )
        ).filter(
          (el) => !el.disabled && el.offsetParent !== null
        );

        const index = focusable.indexOf(document.activeElement);
        if (index > -1) {
          e.preventDefault();

          // If last element → do nothing
          const next = focusable[index + 1];
          if (next) {
            next.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}

export default useEnterNavigation;
