import { CalendarSection } from "./work_os_calendar_grid";
import { initWorkOsStore } from "./work_os_store";

function CalendarPanel() {
  initWorkOsStore();

  return (
    <div class="h-full overflow-y-auto bg-bg-primary p-3">
      <CalendarSection />
    </div>
  );
}

export { CalendarPanel };
